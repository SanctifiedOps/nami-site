import type {
  ContributionBlock,
  ContributionRichTextSpan,
} from "@/lib/network-contributions/types";
import { normaliseContributionUrl } from "@/lib/network-contributions/links";

function richTextParagraphs(block: ContributionBlock) {
  const source = block.richText?.length
    ? block.richText
    : [{ text: block.text } satisfies ContributionRichTextSpan];
  const paragraphs: ContributionRichTextSpan[][] = [[]];

  for (const span of source) {
    const parts = span.text.split(/(\n\s*\n)/);
    for (const part of parts) {
      if (/^\n\s*\n$/.test(part)) {
        if (paragraphs.at(-1)?.length) paragraphs.push([]);
        continue;
      }
      if (part) paragraphs.at(-1)?.push({ ...span, text: part });
    }
  }

  return paragraphs.filter((paragraph) => paragraph.some((span) => span.text.trim()));
}

function RichSpan({ span }: { span: ContributionRichTextSpan }) {
  let content: React.ReactNode = span.text;
  if (span.bold) content = <strong>{content}</strong>;
  if (span.italic) content = <em>{content}</em>;
  if (span.underline) content = <u>{content}</u>;

  const href = normaliseContributionUrl(span.href);
  if (href) {
    content = (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function ContributionRichText({
  block,
  firstParagraphClassName,
}: {
  block: ContributionBlock;
  firstParagraphClassName?: string;
}) {
  return richTextParagraphs(block).map((paragraph, paragraphIndex) => (
    <p
      key={`${block.id}-${paragraphIndex}`}
      className={`whitespace-pre-line ${paragraphIndex === 0 ? firstParagraphClassName ?? "" : ""}`}
    >
      {paragraph.map((span, spanIndex) => (
        <RichSpan key={`${block.id}-${paragraphIndex}-${spanIndex}`} span={span} />
      ))}
    </p>
  ));
}
