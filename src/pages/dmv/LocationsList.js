import React from 'react';
import {Link} from 'react-router-dom';

export default function LocationsList() {
  const data = [
    {
      title: 'Waldorf',
      url: 'waldorf',
      phone: '(301) 967-9100',
      address: '11850 Pika Drive\nWaldorf, MD 20602',
    },
    {
      title: 'Fredericksburg',
      url: 'fredericksburg',
      phone: '(540) 898-5227',
      address: '5213 Jefferson Davis Hwy\nFredericksburg, VA 22408',
    },
    {
      title: 'Manassas',
      url: 'manassas',
      phone: '(703) 330-8095',
      address: '9109 Owens Drive\nManassas Park, VA 20111',
    },
  ];

  return (
    <div className="locations__list">
      {data.map((item) => (
        <Link
          key={item?.url}
          to={`/decking/locations/${item?.url}`}
        >
          <div className='location__item'>
            <div className='location__item__title'>{item?.title}</div>
            <div className='location__item__phone'>
              <img src={require('./img/phone-red.svg').default} alt='phone'/>
              {item?.phone}
            </div>
            <div className='location__item__address'>
              <img src={require('./img/location-red.svg').default} alt='phone'/>
              <div className='location__item__text'>
                {item?.address}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
