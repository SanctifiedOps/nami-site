-- High-confidence category corrections from the 14 October 2026 production audit.
-- The previous group guard prevents an unexpected overwrite if a member has since edited their profile.
WITH corrections(member_id, previous_group, next_group) AS (
  VALUES
    ('adam-barnsley-photography-a50cde7b', 'artists', 'photographers'),
    ('adventures-in-tiny-tyne-b72894a8', 'artists', 'photographers'),
    ('adam-blower-3ce52e21', 'artists', 'creative-services'),
    ('biggi-e9b414a6', 'artists', 'designers'),
    ('billie-learmonth-graduate-graphic-designer-a31e72bc', 'artists', 'designers'),
    ('bloom-digitally-5ff26d4c', 'artists', 'creative-services'),
    ('design-in-everything-908ca2bb', 'artists', 'community-events'),
    ('emlydesigns-27eab169', 'artists', 'makers'),
    ('fred-chyke-acb8f59c', 'artists', 'music'),
    ('georgia-nichol-creative-33cd6c52', 'artists', 'designers'),
    ('james-carroll-3b43971b', 'artists', 'designers'),
    ('jasburysabin-9d52a8b3', 'artists', 'writing-content'),
    ('jenny-lin-539dd6a9', 'artists', 'photographers'),
    ('laura-lee-c10fd5d8', 'artists', 'performance'),
    ('margaret-woodliff-wright-miliinery-f01586b6', 'artists', 'makers'),
    ('markmaker-e1b830b7', 'artists', 'designers'),
    ('may-photography-f67cecdb', 'artists', 'photographers'),
    ('michele-riveroll-c64d78c2', 'artists', 'makers'),
    ('northern-tattoo-collective-b7760a90', 'artists', 'independent-businesses'),
    ('oracle-beauty-9abcd545', 'artists', 'independent-businesses'),
    ('origin-55-64ae6273', 'artists', 'independent-businesses'),
    ('rachel-riley-photography-a7cacf9d', 'artists', 'photographers'),
    ('sit-stay-ne-66c005fd', 'artists', 'independent-businesses'),
    ('sweet-boy-693dcf43', 'artists', 'performance'),
    ('the-north-east-dog-photographer-a47c3e5a', 'artists', 'photographers'),
    ('unique-magazines-ltd-eb206b5f', 'artists', 'independent-businesses'),
    ('weezy-pop-012b181c', 'artists', 'makers'),
    ('wicca-witch-of-the-north-555e7e58', 'artists', 'makers'),
    ('women-of-nerd-culture-63d6921e', 'artists', 'music'),
    ('jodie-beardmore-680da2d8', 'writing-content', 'photographers')
)
UPDATE member_profiles
SET primary_group = (
      SELECT next_group
      FROM corrections
      WHERE corrections.member_id = member_profiles.member_id
        AND corrections.previous_group = member_profiles.primary_group
    ),
    updated_at = unixepoch() * 1000
WHERE EXISTS (
  SELECT 1
  FROM corrections
  WHERE corrections.member_id = member_profiles.member_id
    AND corrections.previous_group = member_profiles.primary_group
);

INSERT INTO sheet_sync_jobs (
  id, member_id, status, attempts, next_attempt_at, created_at, updated_at
)
SELECT
  'category-audit-2026-10-14-' || member_id,
  member_id,
  'pending',
  0,
  unixepoch() * 1000,
  unixepoch() * 1000,
  unixepoch() * 1000
FROM member_profiles
WHERE member_id IN (
  'adam-barnsley-photography-a50cde7b',
  'adventures-in-tiny-tyne-b72894a8',
  'adam-blower-3ce52e21',
  'biggi-e9b414a6',
  'billie-learmonth-graduate-graphic-designer-a31e72bc',
  'bloom-digitally-5ff26d4c',
  'design-in-everything-908ca2bb',
  'emlydesigns-27eab169',
  'fred-chyke-acb8f59c',
  'georgia-nichol-creative-33cd6c52',
  'james-carroll-3b43971b',
  'jasburysabin-9d52a8b3',
  'jenny-lin-539dd6a9',
  'laura-lee-c10fd5d8',
  'margaret-woodliff-wright-miliinery-f01586b6',
  'markmaker-e1b830b7',
  'may-photography-f67cecdb',
  'michele-riveroll-c64d78c2',
  'northern-tattoo-collective-b7760a90',
  'oracle-beauty-9abcd545',
  'origin-55-64ae6273',
  'rachel-riley-photography-a7cacf9d',
  'sit-stay-ne-66c005fd',
  'sweet-boy-693dcf43',
  'the-north-east-dog-photographer-a47c3e5a',
  'unique-magazines-ltd-eb206b5f',
  'weezy-pop-012b181c',
  'wicca-witch-of-the-north-555e7e58',
  'women-of-nerd-culture-63d6921e',
  'jodie-beardmore-680da2d8'
)
ON CONFLICT(id) DO NOTHING;
