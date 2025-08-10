import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PhotoItem from './PhotoItem';

const photos = [
  {
    filename: 'yeomsebeen_field.jpg',
    title: '球場應援',
  },
  {
    filename: 'yeomsebeen_cuteface.jpg',
    title: '可愛鬼臉',
  },
  {
    filename: 'yeomsebeen_student.jpg',
    title: '活動裝扮',
  },
  {
    filename: 'yeomsebeen_about.jpg',
    title: '專輯封面',
  },
  { filename: 'yeomsebeen_ballet_dress.jpeg',
    title: '芭蕾風格',
  }
];

const PhotoGallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Lightbox still needs the full URL, so we construct it here
  const slides = photos.map(photo => ({
    src: `${process.env.PUBLIC_URL}/${photo.filename}`,
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
