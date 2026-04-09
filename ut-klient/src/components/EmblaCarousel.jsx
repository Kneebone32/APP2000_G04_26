import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './EmblaCarouselThumbsButton'
import './embla.css'

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  })
  const safeSlides = Array.isArray(slides) ? slides : []

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    const currentIndex = emblaMainApi.selectedScrollSnap()
    setSelectedIndex(currentIndex)
    emblaThumbsApi.scrollTo(currentIndex)
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reinit', onSelect)
  }, [emblaMainApi, onSelect])

  const getImageSrc = (slide) => {
    if (!slide) return ''

    if (typeof slide === 'string') {
      return slide
    }

    return (
      slide?.url ||
      slide?.tur_url ||
      slide?.bilde_url ||
      slide?.hovedbilde_url ||
      slide?.aktivitet_url ||
      ''
    )
  }

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {safeSlides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <img 
                src={getImageSrc(slide)} 
                alt={`Slide ${index + 1}`}
                className="embla__slide__image"
              />
            </div>
          ))}
        </div>
      </div>

      {safeSlides.length > 0 && (
        <div className="embla-thumbs">
          <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
            <div className="embla-thumbs__container">
              {safeSlides.map((slide, index) => (
                <Thumb
                  key={index}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                  image={getImageSrc(slide)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmblaCarousel
