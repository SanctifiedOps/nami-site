import { notFound } from "next/navigation";
import { MemberArticle, type MemberArticleView } from "../../member-article";

export const metadata = {
  title: "Member article preview | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export default function MemberArticlePreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const article: MemberArticleView = {
    title: "What painting a studio wall taught me about working in public",
    summary:
      "A short account of making a mural while the building stayed open, and what changed when people could watch it develop.",
    format: "project_story",
    publishedAt: new Date().toISOString(),
    content: {
      version: 1,
      blocks: [
        {
          id: "opening",
          type: "paragraph",
          text: "I thought the difficult part would be scaling the drawing onto a twelve-metre wall. It turned out to be answering questions while I was halfway up a ladder with a brush in my hand.",
        },
        {
          id: "room-open",
          type: "heading",
          text: "The room stayed open",
        },
        {
          id: "middle",
          type: "paragraph",
          text: "People passed through all week. Some stopped for ten seconds, some came back each day, and a few told me what the building meant to them. Those conversations changed small parts of the image. A colour became warmer. A face turned slightly towards the door.",
        },
        {
          id: "quote",
          type: "quote",
          text: "The work felt less like a reveal and more like something we had watched grow together.",
        },
        {
          id: "ending",
          type: "paragraph",
          text: "I still like the quiet of a studio, but I would work in public again. It made the process visible, including the awkward bits, and people understood the finished wall differently because they had seen those decisions happen.",
        },
      ],
    },
    author: {
      id: "mara-bell-preview",
      name: "Mara Bell",
      speciality: "Mural artist and illustrator",
      location: "Gateshead",
      bio: "Mara makes large-scale illustrations and public artwork across the North East.",
    },
  };

  return <MemberArticle article={article} previewMode />;
}
