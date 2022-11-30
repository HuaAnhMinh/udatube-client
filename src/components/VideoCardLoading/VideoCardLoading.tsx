import {Card} from "@mui/material";
import {useEffect, useState} from "react";
import useWindowDimensions from "../../utils/useWindowDimensions.config";

const VideoCardLoading = () => {
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const cardWidth = document.getElementsByClassName("VideoCard")[0]?.clientWidth;
    if (cardWidth) {
      setHeight((cardWidth * 9 / 16) + 120);
    }
  }, [width]);

  return (
    <Card
      className={'VideoCard'}
      sx={{
        cursor: 'pointer',
        boxShadow: 'none',
        borderRadius: '15px',
        height,
      }}
    >
      <div>
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
            borderRadius: '15px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 0' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
            }}
          />
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
            <div
              style={{
                width: '100%',
                height: '25px',
                backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                borderRadius: '4px'
              }}
            />
            <div
              style={{
                width: '40%',
                height: '15px',
                backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                borderRadius: '4px',
                marginTop: '15px'
              }}
            />
            <div
              style={{
                width: '40%',
                height: '15px',
                backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
                borderRadius: '4px',
                marginTop: '5px'
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCardLoading;