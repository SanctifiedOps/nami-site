import { notFound } from "next/navigation";
import { AdminDashboard } from "../admin-dashboard";

export const metadata = { title: "Network admin preview", robots: { index: false, follow: false } };

export default function NetworkAdminPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const now = new Date();
  const iso = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
  const member = (id: string, name: string, group: string, location: string, daysAgo: number) => ({
    id, firstName: name.split(" ")[0], email: `${id}@preview.local`, accountStatus: "active", role: "member", joinedAt: iso(daysAgo), lastLoginAt: iso(Math.min(daysAgo, 2)),
    displayName: name, location, primaryGroup: group, speciality: group === "artists" ? "Visual artist" : "Creative business", profileImageKey: `${id}.webp`, published: true, links: [`https://example.com/${id}`],
  });

  return <AdminDashboard
    adminName="Joe"
    applications={[]}
    members={[
      member("preview-1", "Northern Cave", "artists", "Newcastle", 2),
      member("preview-2", "Aniseed Creative", "designers", "Gateshead", 8),
      member("preview-3", "Studio North", "photographers", "Sunderland", 15),
      member("preview-4", "Tyne Sound", "music", "Newcastle", 27),
      member("preview-5", "Made Up North", "makers", "Durham", 45),
      member("preview-6", "North East Film", "film-video", "North Tyneside", 63),
    ]}
    tickets={[{
      id: "NAMI-PREVIEW-01", memberId: "preview-1", name: "Preview member", email: "preview@local.test", subject: "Profile link needs checking", description: "This is representative preview content for the redesigned task view.", pageUrl: "http://localhost:3000/network/directory", status: "open", priority: "urgent", createdAt: iso(1), updatedAt: iso(1), resolvedAt: null,
    }]}
    events={[]}
    operations={{ failedAlerts: 0, pendingAlerts: 1, failedEmails: 0, pendingEmails: 0, failedSyncs: 1, pendingSyncs: 0 }}
    ga={{ connected: true, users: 557, sessions: 920, views: 2423, usersChange: 218, directorySearches: 167, profileClicks: 232 }}
    instagram={{ connected: true, username: "namicreativeuk", followers: 3090, mediaCount: 49 }}
    mailchimp={{ connected: true, audienceName: "Nami Creative", subscribers: 196, openRate: 52.5, clickRate: 7.9, campaignCount: 7, latestCampaign: "Latest NAMI campaign" }}
  />;
}
