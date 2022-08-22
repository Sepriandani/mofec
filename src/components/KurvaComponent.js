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
    series: [
      {
        data: [1, 2, 1, 4, 3, 6]
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