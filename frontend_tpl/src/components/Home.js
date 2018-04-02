import React from 'react';
import {Link} from 'react-router-dom';
// import { Carousel } from 'react-responsive-carousel';
import Carousel from './Carousel.js';

class Home extends React.Component {
    render(){
        return(
            <div>
                <h1 className='homepage'>TPL</h1>
                <h1 className='homeblurb'>(Toronto Ultimate Club Parity League)</h1>
                <div className='homepageblurb'>
                    <Link to={'/stats'} className='homepageEnter'>Enter Here</Link>
                    <Carousel autoPlayInterval={4000} indicator={true} switcher={true}>
                        <div>
                            <img src='../images/TPL1.jpg'/>
                            <img src='../images/TPL2.jpg'/>
                            <img src='../images/TPL3.jpg'/>
                        </div>
                        <div>
                            <img src='../images/TPL4.jpg'/>
                            <img src='../images/TPL5.jpg'/>
                            <img src='../images/TPL6.jpg'/>
                            <img src='../images/TPL10.jpg'/>
                        </div>
                        <div>
                            <img src='../images/TPL7.jpg'/>
                            <img src='../images/TPL8.jpg'/>
                            <img src='../images/TPL9.jpg'/>
                        </div>
	                </Carousel>
                    <h4 className='footer'>Ed Kung Photography</h4>
                </div>
            </div>
        )
    };
}

export default Home;