interface NotionEmbedProps {
  title: string
  sub?: string
  embedUrl?: string
}

export default function NotionEmbed({ title, sub, embedUrl }: NotionEmbedProps) {
  return (
    <div className="notion-embed-wrap">
      <div className="notion-embed-label">內容由 Notion 即時同步，持續更新中</div>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          style={{ width: '100%', height: 480, borderRadius: 12, border: '0.5px solid var(--color-border)' }}
          title={title}
        />
      ) : (
        <div className="notion-placeholder">
          <div className="notion-placeholder-text">{title}</div>
          {sub && <div className="notion-placeholder-sub">{sub}</div>}
        </div>
      )}
    </div>
  )
}
