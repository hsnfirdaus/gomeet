import React, { use, useMemo, useState } from "react";
import RoomContext from "../context/Room.Context";
import MediaVideo from "../../../components/MediaVideo";
import MediaEmpty from "../../../components/MediaEmpty";
import Button from "../../../components/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Logo from "../../../components/Logo";

const maxView = 4;
const MediaGrid: React.FC = () => {
  const { listMedia, username } = use(RoomContext);
  const [page, setPage] = useState(1);

  const totalPage = useMemo(() => {
    return Math.ceil(listMedia.length / maxView);
  }, [listMedia, maxView]);

  const currentView = useMemo(() => {
    const offset = (page - 1) * maxView;

    return listMedia.slice(offset, offset + maxView);
  }, [page, maxView, listMedia]);

  return (
    <React.Fragment>
      <div className="p-4 flex justify-between">
        <Logo />

        {totalPage > 1 ? (
          <div className="flex items-center justify-center gap-4">
            <Button
              icon={<ChevronLeftIcon />}
              variant={page === 1 ? "default" : "primary"}
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            />
            <span className="font-bold text-white">
              {page}/{totalPage}
            </span>
            <Button
              icon={<ChevronRightIcon />}
              variant={page === totalPage ? "default" : "primary"}
              disabled={page === totalPage}
              onClick={() => setPage((prev) => prev + 1)}
            />
          </div>
        ) : (
          <React.Fragment />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-4 items-center justify-center p-4 lg:p-0 min-h-0">
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-4">
          {currentView.map((media, idx) => (
            <div
              key={media.stream?.id ?? idx}
              className={
                currentView.length === 1
                  ? "col-span-4 row-span-4"
                  : currentView.length === 2
                  ? "row-span-2 col-span-4 lg:row-span-4 lg:col-span-2"
                  : currentView.length === 3
                  ? idx === 0
                    ? "col-span-4 row-span-2"
                    : "row-span-2 col-span-2"
                  : "col-span-2 row-span-2"
              }
            >
              {media.stream ? (
                <MediaVideo
                  title={media.username}
                  media={media.stream}
                  isMuted={media.username === username}
                />
              ) : (
                <MediaEmpty title={media.username} />
              )}
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};
export default MediaGrid;
