param([switch]$Create)

$ErrorActionPreference = 'Stop'
$envLine = Get-Content (Join-Path $PSScriptRoot '..\.env.local') |
  Where-Object { $_ -match '^MAKE_API_TOKEN=' } | Select-Object -First 1
if (-not $envLine) { throw 'MAKE_API_TOKEN is missing from .env.local' }
$token = $envLine.Substring('MAKE_API_TOKEN='.Length)
$headers = @{ Authorization = "Token $token" }
$api = 'https://eu2.make.com/api/v2'
$template = (Invoke-RestMethod -Uri "$api/scenarios/9758590/blueprint" -Headers $headers).response.blueprint |
  ConvertTo-Json -Depth 100 | ConvertFrom-Json -AsHashtable

function Copy-Module($module, $id, $label) {
  $copy = $module | ConvertTo-Json -Depth 100 | ConvertFrom-Json -AsHashtable
  $copy.id = $id
  $copy.metadata.designer.name = $label
  return $copy
}

$sourceId = '1uyNibCoH2sVR_z6MTAtPzvQygdogaGrrhwdC7_KoIoY'
$feedId = '1HdIJ9lblM_eiUzUNzVmdL3r7s-U-YaCE7Pbxedwc5Xc'
$sourceSearch = $template.flow[0]
$emailTemplate = $template.flow[1]
$updateTemplate = $template.flow[2]

$next = Copy-Module $sourceSearch 1 'Choose member not recently featured'
$next.mapper.spreadsheetId = $sourceId
$next.mapper.sheetId = 'Creative Network'
$next.mapper.tableFirstRow = 'A1:AG1'
$next.mapper.limit = 1
$next.mapper.filter = @(, @(
  @{ a = 'T'; b = 'Ready'; o = 'text:equal' },
  @{ a = 'W'; o = 'exist' }
))
$next.mapper.orderBy = 'M'
$next.mapper.fieldType = 'text'
$next.mapper.sortOrder = 'asc'

$current = Copy-Module $sourceSearch 2 'Find current featured card'
$current.mapper.spreadsheetId = $feedId
$current.mapper.sheetId = 'Directory'
$current.mapper.tableFirstRow = 'A1:M1'
$current.mapper.limit = 1
$current.mapper.filter = @(, @(@{ a = 'M'; b = 'TRUE'; o = 'text:equal' }))

$nextCard = Copy-Module $current 3 'Find next member directory card'
$nextCard.mapper.filter = @(, @(@{ a = 'J'; b = '{{1.`22`}}'; o = 'text:equal' }))

$currentSource = Copy-Module $sourceSearch 4 'Find current member database row'
$currentSource.mapper.spreadsheetId = $sourceId
$currentSource.mapper.sheetId = 'Creative Network'
$currentSource.mapper.tableFirstRow = 'A1:AG1'
$currentSource.mapper.limit = 1
$currentSource.mapper.filter = @(, @(@{ a = 'W'; b = '{{2.`9`}}'; o = 'text:equal' }))

$featureNext = Copy-Module $updateTemplate 5 'Feature next directory card'
$featureNext.mapper.spreadsheetId = "/$feedId"
$featureNext.mapper.sheetId = 'Directory'
$featureNext.mapper.rowNumber = '{{3.__ROW_NUMBER__}}'
$featureNext.mapper.values = @{ Featured = 'TRUE' }

$unfeatureCurrent = Copy-Module $featureNext 6 'Clear previous directory feature'
$unfeatureCurrent.mapper.rowNumber = '{{2.__ROW_NUMBER__}}'
$unfeatureCurrent.mapper.values = @{ Featured = 'FALSE' }

$archiveCurrent = Copy-Module $updateTemplate 7 'Mark previous member featured before'
$archiveCurrent.mapper.spreadsheetId = "/$sourceId"
$archiveCurrent.mapper.sheetId = 'Creative Network'
$archiveCurrent.mapper.rowNumber = '{{4.__ROW_NUMBER__}}'
$archiveCurrent.mapper.values = @{ 'Feature Status' = 'Previously featured' }

$markNext = Copy-Module $archiveCurrent 8 'Record new featured member and date'
$markNext.mapper.rowNumber = '{{1.__ROW_NUMBER__}}'
$markNext.mapper.values = @{
  'Last Featured Date' = '{{formatDate(now; "YYYY-MM-DD"; "Europe/London")}}'
  'Feature Status' = 'Featured'
  'Feature Notes' = 'Directory homepage feature, selected by weekly rotation'
}

$notice = Copy-Module $emailTemplate 9 'Email Joe the new featured member'
$notice.mapper.subject = 'Featured member this week: {{3.`0`}}'
$notice.mapper.contentType = 'html'
$notice.mapper.content = '<p>Hiya Joe,</p><p><strong>{{3.`0`}}</strong> is now the featured member on the <a href="https://namicreative.co.uk/network/directory">NAMI Creative Network directory</a>.</p><p>{{3.`8`}}</p><p>Previous feature: {{2.`0`}}.</p>'
$notice.mapper.toRecipients = @(@{ name = 'NAMI Creative'; address = 'hello@namicreative.co.uk' })

$template.name = 'NAMI Creative Network - Weekly Featured Member'
$template.flow = @($next, $current, $nextCard, $currentSource, $featureNext, $unfeatureCurrent, $archiveCurrent, $markNext, $notice)
$template.metadata.designer.orphans = @()
$scheduling = @{ type = 'indefinitely'; interval = 900; restrict = @(@{ days = @(5); time = @('08:00', '08:01') }) }

if (-not $Create) {
  Write-Output "Dry run: $($template.flow.Count) modules; Friday 08:00 Europe/London; email to hello@namicreative.co.uk."
  Write-Output ('Candidate filter: ' + (ConvertTo-Json -InputObject $next.mapper.filter -Depth 5 -Compress))
  exit 0
}

$existing = (Invoke-RestMethod -Uri "$api/scenarios?teamId=1535336" -Headers $headers).scenarios |
  Where-Object { $_.name -eq $template.name }
if ($existing) { throw "A weekly featured-member scenario already exists: $($existing.id -join ', ')" }

$payload = @{
  name = $template.name
  teamId = 1535336
  blueprint = ($template | ConvertTo-Json -Depth 100 -Compress)
  scheduling = ($scheduling | ConvertTo-Json -Depth 10 -Compress)
} | ConvertTo-Json -Depth 10 -Compress
$created = Invoke-RestMethod -Uri "$api/scenarios?confirmed=true" -Headers $headers -Method Post -ContentType 'application/json' -Body $payload
$scenario = $created.scenario ?? $created.response
Write-Output "Created scenario $($scenario.id): $($scenario.name)"
