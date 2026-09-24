import { notFound } from "next/navigation";
import { DashboardForm } from "../dashboard-form";

export const metadata = { title: "Member dashboard preview", robots: { index: false, follow: false } };

export default function MemberDashboardPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <DashboardForm
    previewMode
    firstName="Joe"
    isAdmin
    email="hello@namicreative.co.uk"
    eventsEnabled={false}
    initialProfile={{
      memberId: "joe-wilson-nami-creative",
      displayName: "Joe Wilson / NAMI Creative",
      location: "Newcastle upon Tyne",
      primaryGroup: "creative-services",
      speciality: "Creative consultant",
      bio: "A freelance creative consultant helping North East creatives, brands and businesses make waves, get their work seen and create a stronger impact.",
      about: "I run NAMI Creative and work with people across the North East to turn good ideas into clear brands, useful websites and campaigns that connect with the right audience.\n\nMy work brings creative direction, design and practical marketing together. I enjoy helping independent businesses and creative people explain what they do, show their work properly and build something they can keep developing.",
      websiteUrl: "https://namicreative.co.uk",
      instagramUrl: "https://www.instagram.com/namicreativeuk/",
      facebookUrl: "",
      linkedinUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
      profileImageKey: "/images/network/members/joe-wilson-nami-creative.webp",
    }}
    initialImages={[
      {
        id: "00000000-0000-4000-8000-000000000001",
        r2Key: "/images/north-east/4.jpg",
        position: 0,
        altText: "A NAMI Creative project photographed outdoors",
        title: "North East creative project",
        description: "A collaborative project made with creative people from across the region.",
        linkUrl: "https://namicreative.co.uk/work",
        width: 900,
        height: 1500,
      },
    ]}
  />;
}
