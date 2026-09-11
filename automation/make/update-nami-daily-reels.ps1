param(
  [string]$EnvFile = (Join-Path $PSScriptRoot '..\..\.env.local'),
  [int]$ScenarioId = 9778719,
  [string]$Zone = 'eu2'
)

$ErrorActionPreference = 'Stop'

function Get-EnvValue([string]$Name) {
  $line = Get-Content -LiteralPath $EnvFile | Where-Object { $_ -match "^$([regex]::Escape($Name))=" } | Select-Object -First 1
  if (-not $line) { throw "$Name is missing from $EnvFile" }
  return $line.Substring($line.IndexOf('=') + 1).Trim()
}

function New-Designer([int]$X, [string]$Name) {
  return [pscustomobject]@{ x = $X; y = 0; name = $Name }
}

$token = Get-EnvValue 'MAKE_API_TOKEN'
$headers = @{ Authorization = "Token $token"; 'Content-Type' = 'application/json' }
$baseUrl = "https://$Zone.make.com/api/v2"

$response = Invoke-RestMethod -Uri "$baseUrl/scenarios/$ScenarioId/blueprint" -Headers $headers -Method Get
$blueprint = $response.response.blueprint
$flow = [System.Collections.ArrayList]@($blueprint.flow)

$managedIds = @(14, 15, 16, 17, 18, 19)
foreach ($id in $managedIds) {
  $existing = @($flow | Where-Object { $_.id -eq $id })
  foreach ($module in $existing) { [void]$flow.Remove($module) }
}

$reader = [pscustomobject]@{
  id = 14
  mapper = [pscustomobject]@{
    from = 'drive'; limit = 200
    filter = @(@([pscustomobject]@{ a = 'R'; b = 'Ready to film'; o = 'text:equal' }))
    orderBy = '__ROW_NUMBER__'; sheetId = 'Reel Scripts'; fieldType = 'text'; sortOrder = 'desc'
    spreadsheetId = '1M7uDoBeNjNel_7qV9jsNgxZZUl8wTfFGnkeHtxefYiI'; tableFirstRow = 'A1:S1'; includesHeaders = $true
    valueRenderOption = 'FORMATTED_VALUE'; dateTimeRenderOption = 'FORMATTED_STRING'
  }
  module = 'google-sheets:filterRows'; version = 2
  metadata = [pscustomobject]@{ designer = New-Designer 2025 'Read existing Reel Script Bank' }
  parameters = [pscustomobject]@{ __IMTCONN__ = 14434905 }
}

$aggregator = [pscustomobject]@{
  id = 15
  mapper = [pscustomobject]@{ properties = [pscustomobject]@{
    id = '{{14.`0`}}'; theme = '{{14.`1`}}'; emotionalTruth = '{{14.`3`}}'; hook = '{{14.`4`}}'; payoff = '{{14.`12`}}'
  }}
  module = 'builtin:BasicAggregator'; version = 1
  metadata = [pscustomobject]@{
    restore = [pscustomobject]@{ extra = [pscustomobject]@{
      feeder = [pscustomobject]@{ label = 'Read existing Reel Script Bank [14]' }
      target = [pscustomobject]@{ label = 'Custom' }
    }}
    designer = New-Designer 2175 'Build lifetime Reel exclusions'
  }
  parameters = [pscustomobject]@{ feeder = 14 }
}

$module6 = $flow | Where-Object { $_.id -eq 6 } | Select-Object -First 1
if ($module6.mapper.input -notmatch 'EXISTING REEL SCRIPT BANK') {
  $module6.mapper.input += "`n`nEXISTING REEL SCRIPT BANK (lifetime exclusions):`n{{15.array}}"
}
$module6.mapper.instructions = $module6.mapper.instructions -replace 'Do not reuse a Reel premise, opening hook, text-carousel argument or showcase angle used in the previous 30 days\.', 'Never reuse a Reel premise, emotional truth, opening hook or payoff already present in the EXISTING REEL SCRIPT BANK. Also do not reuse a text-carousel argument or showcase angle used in the previous 30 days.'
$module6.mapper.instructions = $module6.mapper.instructions -replace 'Use a healthy mix across the week:[\s\S]*?particular audio trend\.', @'
The Reel section is for creatives, freelancers, makers, artists and small independent businesses. Lead with the thought they have felt but rarely say aloud. Prioritise the emotional reality of making a living from creative work: feeling invisible, comparison, confidence, rejection, inconsistent demand, content fatigue, isolation, burnout, lack of time, fear of being seen, protecting creative identity and keeping momentum. Pricing and finding clients can appear, but must not be the main subject of most daily Reels.

Use a healthy mix across the week. Every Reel must move from recognition into useful perspective or action, then finish with a grounded, inspirational, motivational or authoritative payoff. Avoid generic motivation, therapy language, fake controversy, vague clickbait, guaranteed results, lip-sync concepts, elaborate sketches, faceless stock-footage Reels and ideas that depend on a particular audio trend.
'@

$extractor = [pscustomobject]@{
  id = 16
  mapper = [pscustomobject]@{
    input = '{{6.result}}'; model = 'gpt-5-mini'; store = $false; inputContentType = 'text'; max_output_tokens = 5000; createConversation = $false
    instructions = @'
Extract the three Reel scripts from this NAMI Post Ideas HTML email for the Reel Script Bank.

Return plain text only. Return exactly three records separated by ###REEL###. Do not add Markdown, commentary, headings or line breaks. Each record must contain exactly 18 fields separated by ||| in this order:
Theme ||| Audience pain ||| Emotional truth ||| Hook ||| Super Hook ||| Open Loop ||| Body 1 ||| Rehook 1 ||| Body 2 ||| Rehook 2 ||| Body 3 ||| Payoff / CTA ||| On-screen title ||| Filming notes ||| Duration ||| Caption direction ||| Status ||| Research source

Use Ready to film for Status. Use Daily NAMI briefing for Research source. Keep the script wording exactly as supplied in the email. Do not use ||| or ###REEL### inside any field. Before returning, verify that there are three records and 18 fields in every record.
'@
  }
  module = 'openai-gpt-3:createModelResponse'; version = 1
  metadata = [pscustomobject]@{ designer = New-Designer 2550 'Extract three Reels for script bank'; parameters = @([pscustomobject]@{ name='__IMTCONN__'; type='account:openai-gpt-3'; label='Connection'; required=$true }) }
  parameters = [pscustomobject]@{ __IMTCONN__ = 8417474 }
}

function New-ReelRow([int]$Id, [int]$Record, [int]$X) {
  $headers = @('Theme','Audience pain','Emotional truth','Hook','Super Hook','Open Loop','Body 1','Rehook 1','Body 2','Rehook 2','Body 3','Payoff / CTA','On-screen title','Filming notes','Duration','Caption direction','Status','Research source')
  $values = [ordered]@{ ID = "{{1.runId}}-R$Record" }
  for ($i = 0; $i -lt $headers.Count; $i++) {
    $field = $i + 1
    $values[$headers[$i]] = "{{get(split(get(split(16.result; `"###REEL###`"); $Record); `"|||`"); $field)}}"
  }
  return [pscustomobject]@{
    id = $Id
    mapper = [pscustomobject]@{
      from='drive'; mode='select'; values=[pscustomobject]$values; sheetId='Reel Scripts'
      spreadsheetId='/1M7uDoBeNjNel_7qV9jsNgxZZUl8wTfFGnkeHtxefYiI'; includesHeaders=$true
      insertDataOption='INSERT_ROWS'; useColumnHeaders=$true; valueInputOption='USER_ENTERED'; insertUnformatted=$false
    }
    module='google-sheets:addRow'; version=2
    metadata=[pscustomobject]@{ designer = New-Designer $X "Append Reel $Record to Script Bank" }
    parameters=[pscustomobject]@{ __IMTCONN__ = 14434905 }
  }
}

$row1 = New-ReelRow 17 1 2700
$row2 = New-ReelRow 18 2 2850
$row3 = New-ReelRow 19 3 3000

$rebuilt = [System.Collections.ArrayList]::new()
foreach ($module in $flow) {
  if ($module.id -eq 6) {
    [void]$rebuilt.Add($reader); [void]$rebuilt.Add($aggregator)
  }
  [void]$rebuilt.Add($module)
  if ($module.id -eq 7) {
    [void]$rebuilt.Add($extractor); [void]$rebuilt.Add($row1); [void]$rebuilt.Add($row2); [void]$rebuilt.Add($row3)
  }
}

$blueprint.flow = @($rebuilt)
$payload = [pscustomobject]@{
  blueprint = ($blueprint | ConvertTo-Json -Depth 100 -Compress)
  scheduling = ($response.response.scheduling | ConvertTo-Json -Depth 20 -Compress)
}
$body = $payload | ConvertTo-Json -Depth 10
$updated = Invoke-RestMethod -Uri "$baseUrl/scenarios/$ScenarioId" -Headers $headers -Method Patch -Body $body

[pscustomobject]@{
  scenarioId = $ScenarioId
  updated = $true
  moduleIds = @($blueprint.flow | ForEach-Object { $_.id })
  reelBank = 'https://docs.google.com/spreadsheets/d/1M7uDoBeNjNel_7qV9jsNgxZZUl8wTfFGnkeHtxefYiI/edit'
} | ConvertTo-Json -Depth 5
