const NoteSkeleton = () => {
  return (
    <div className="notes-grid" aria-label="در حال بارگذاری یادداشت‌ها">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="note-skeleton" key={index}>
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-date" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-content" />
          <div className="skeleton-actions">
            <div className="skeleton-button" />
            <div className="skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteSkeleton;
