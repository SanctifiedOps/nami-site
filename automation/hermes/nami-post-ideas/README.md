# NAMI Post Ideas automation

This directory contains the Hermes editorial instructions and the JSON contract for NAMI's daily content briefing.

## External state

- Content ledger: `1585jjAKNNzhv_pbxFXU_Lricundjfz_kLOvZYtpAqZk`
- Public directory feed: `1HdIJ9lblM_eiUzUNzVmdL3r7s-U-YaCE7Pbxedwc5Xc`
- Timezone: `Europe/London`
- Planned schedule: every day at 09:00

## Delivery design

1. Cloudflare starts the scheduled run while Joe's computer is off.
2. Hermes researches, selects and writes the briefing using `SKILL.md`.
3. The result must validate against `briefing.schema.json`.
4. A Make webhook renders the JSON as a readable HTML email and sends it through the existing Outlook connection.
5. The run and suggestions are written back to the content ledger.

## Release stages

1. Test mode with one manual run.
2. Three scheduled mornings delivered only to Joe.
3. Review source quality, member rotation and writing quality.
4. Enable the permanent 09:00 schedule.

No social content is published automatically.

