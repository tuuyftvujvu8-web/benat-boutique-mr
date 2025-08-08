import React from "react";

const VideoSection: React.FC = () => {
  return (
    <section className="mt-[35px] container" aria-label="فيديو توضيحي">
      <div className="w-full overflow-hidden rounded-lg border border-border shadow-sm">
        <iframe
          className="w-full aspect-video"
          src="https://www.youtube.com/embed/_AufUbQhYb4"
          title="فيديو توضيحي متجر بنات Benat"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default VideoSection;
