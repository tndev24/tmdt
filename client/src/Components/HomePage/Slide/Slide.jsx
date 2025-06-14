import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from './Slide.module.scss';

const cx = classNames.bind(styles);
var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
};

function Slide() {
    return (
        <div className={cx('wrapper')}>
            <Slider {...settings}>
                <div>
                    <img src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_2.jpg?v=880" alt="" />
                </div>
                <div>
                    <img
                        src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_1_master.jpg?v=880"
                        alt=""
                    />
                </div>

                <div>
                    <img src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_8.jpg?v=880" alt="" />
                </div>
            </Slider>
        </div>
    );
}

export default Slide;
