import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PhotoItem from './PhotoItem';

const photos = [
  {
    src: `${process.env.PUBLIC_URL}/yeomsebeen_field.jpg`,
    title: '球場應援',
  },
  {
    src: `${process.env.PUBLIC_URL}/yeomsebeen_cuteface.jpg`,
    title: '可愛鬼臉',
  },
  {
    src: `${process.env.PUBLIC_URL}/yeomsebeen_student.jpg`,
    title: '活動裝扮',
  },
  {
    src: `${process.env.PUBLIC_URL}/yeomsebeen_about.jpg`,
    title: '專輯封面',
  },
];

const PhotoGallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = photos.map(photo => ({
    src: photo.src,
    title: photo.title,
  }));

  const handlePhotoClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <section className="section-gallery py-5">
      <Container id="gallery" className="my-5">
        <h2 className="text-center mb-4 text-white">照片牆</h2>
        <Row>
          {photos.map((photo, idx) => (
            <PhotoItem key={idx} photo={photo} index={idx} onClick={handlePhotoClick} />
          ))}
        </Row>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
        />
      </Container>
    </section>
  );
};

export default PhotoGallery;