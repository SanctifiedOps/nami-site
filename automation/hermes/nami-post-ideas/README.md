# NAMI Post Ideas automation

This directory contains the Hermes editorial instructions and the JSON contract for NAMI's daily content briefing.

## External state

- Content ledger: `1585jjAKNNzhv_pbxFXU_Lricundjfz_kLOvZYtpAqZk`
- Public directory feed: `1HdIJ9lblM_eiUzUNzVmdL3r7s-U-YaCE7Pbxedwc5Xc`
- Timezone: `Europe/London`
- Planned schedule: every day at 09:00

## Delivery design

1. Cloudflare starts the scheduled run while Joe's computer is off.
2. Make reads the Network member pool and approved source registry.
3. Make's existing OpenAI connection researches and writes the briefing using the Hermes editorial instructions in this directory.
4. Make sends the HTML bulletin through the existing Outlook connection.
5. The completed run is written back to the content ledger.

The installed Hermes runtime remains useful for developing and reviewing the editorial prompt locally. The cloud production run uses Make because the local Hermes process stops when Joe's computer is off.

## Release stages

1. Test mode with one manual run.
2. Three scheduled mornings delivered only to Joe.
3. Review source quality, member rotation and writing quality.
4. Enable the permanent 09:00 schedule.

No social content is published automatically.
