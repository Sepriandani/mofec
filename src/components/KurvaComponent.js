import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Kurva IV'
    },
    xAxis: {
      categories: [0, 1.87, 3.67, 5.42, 6.51, 8.01, 11.03, 13.2, 14.79, 15.67, 16.3],
      tickmarkPlacement: 'on',
      title: {
          text: 'Tegangan'
      }
    },
    yAxis: {
      title: {
          text: 'Arus'
      }
    },
    series: [
      {
        name: 'Kurva IV',
        data: [5.69, 5.69, 5.69, 5.67, 5.67, 5.65, 5.61, 4.79, 3.1, 1.75, 0]
      }
    ]
};

export default function KurvaComponent(){

    const chart = useRef();

    return(
        <div className='px-5 lg:px-52 mt-40'>
            <HighchartsReact ref={chart} highcharts={Highcharts} options={options} />
        </div>
    )
}