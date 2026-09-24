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
    applications={[{
      id: "preview-application", email: "hello@thirditeration.com", firstName: "Third", displayName: "Third Iteration", location: "Hexham", requestedCategory: "Publisher",
      bio: "Third Iteration is an independent publisher based in Hexham, making memoirs by people whose lives are more interesting than their public image. First titles include DJ Hurricane's memoir of life with the Beastie Boys and books from Matt Lewis and Jon Shield. I'm always keen to meet writers, designers, and photographers, and to connect on socials.",
      websiteUrl: "https://thirditeration.com/", instagramUrl: "@third_iteration", status: "pending", submittedAt: iso(0), reviewedAt: null,
    }]}
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
    searchEvents={[
      { id: "search-1", eventType: "search", anonymousSessionId: "preview-a", searchQuery: "photographer", categoryFilter: "Photographers", locationFilter: "Newcastle", resultCount: 12, selectedMemberId: null, sourcePath: "/network/directory/all", createdAt: iso(1) },
      { id: "click-1", eventType: "result_clicked", anonymousSessionId: "preview-a", searchQuery: "photographer", categoryFilter: "Photographers", locationFilter: "Newcastle", resultCount: 12, selectedMemberId: "preview-3", sourcePath: "/network/directory/all", createdAt: iso(1) },
      { id: "search-2", eventType: "search", anonymousSessionId: "preview-b", searchQuery: "branding", categoryFilter: "Designers", locationFilter: "All areas", resultCount: 9, selectedMemberId: null, sourcePath: "/network/directory/all", createdAt: iso(2) },
      { id: "click-2", eventType: "result_clicked", anonymousSessionId: "preview-b", searchQuery: "branding", categoryFilter: "Designers", locationFilter: "All areas", resultCount: 9, selectedMemberId: "preview-2", sourcePath: "/network/directory/all", createdAt: iso(2) },
      { id: "search-3", eventType: "search", anonymousSessionId: "preview-c", searchQuery: "studio space", categoryFilter: "All categories", locationFilter: "Gateshead", resultCount: 0, selectedMemberId: null, sourcePath: "/network/directory/all", createdAt: iso(3) },
      { id: "search-4", eventType: "search", anonymousSessionId: "preview-d", searchQuery: "illustrator", categoryFilter: "Artists", locationFilter: "Newcastle", resultCount: 7, selectedMemberId: null, sourcePath: "/network/directory/all", createdAt: iso(4) },
      { id: "search-5", eventType: "search", anonymousSessionId: "preview-e", searchQuery: "videographer", categoryFilter: "Film and video", locationFilter: "Sunderland", resultCount: 2, selectedMemberId: null, sourcePath: "/network/directory/all", createdAt: iso(5) },
    ]}
    ga={{ connected: true, users: 557, sessions: 920, views: 2423, usersChange: 218, directorySearches: 167, profileClicks: 232 }}
    instagram={{ connected: true, username: "namicreativeuk", followers: 3090, mediaCount: 49 }}
    mailchimp={{ connected: true, audienceName: "Nami Creative", subscribers: 196, openRate: 52.5, clickRate: 7.9, campaignCount: 7, latestCampaign: "Latest NAMI campaign" }}
  />;
}
