import DOMPurify from 'dompurify';

const HtmlRenderer = ({ html }: { html: string }) => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return <div className="editor-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default HtmlRenderer;
