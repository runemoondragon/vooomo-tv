'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

// Simple mapping from ISO A3 (from GeoJSON) to ISO A2 (used in app)
// Extend this map as needed based on GeoJSON properties
const isoA3ToA2: { [key: string]: string } = {
  AFG: 'AF', ALB: 'AL', DZA: 'DZ', AND: 'AD', AGO: 'AO', ARG: 'AR', ARM: 'AM', ABW: 'AW', AUS: 'AU',
  AUT: 'AT', AZE: 'AZ', BHS: 'BS', BHR: 'BH', BGD: 'BD', BLR: 'BY', BEL: 'BE', BLZ: 'BZ', BEN: 'BJ',
  BOL: 'BO', BIH: 'BA', BWA: 'BW', BRA: 'BR', BRN: 'BN', BGR: 'BG', BFA: 'BF', BDI: 'BI', KHM: 'KH',
  CMR: 'CM', CAN: 'CA', CPV: 'CV', CAF: 'CF', TCD: 'TD', CHL: 'CL', CHN: 'CN', COL: 'CO', COM: 'KM',
  COD: 'CD', COG: 'CG', CRI: 'CR', CIV: 'CI', HRV: 'HR', CUB: 'CU', CUW: 'CW', CYP: 'CY', CZE: 'CZ',
  DNK: 'DK', DJI: 'DJ', DOM: 'DO', ECU: 'EC', EGY: 'EG', SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE',
  SWZ: 'SZ', ETH: 'ET', FJI: 'FJ', FIN: 'FI', FRA: 'FR', GAB: 'GA', GMB: 'GM', GEO: 'GE', DEU: 'DE',
  GHA: 'GH', GRC: 'GR', GRL: 'GL', GTM: 'GT', GIN: 'GN', GNB: 'GW', GUY: 'GY', HTI: 'HT', HND: 'HN',
  HKG: 'HK', HUN: 'HU', ISL: 'IS', IND: 'IN', IDN: 'ID', IRN: 'IR', IRQ: 'IQ', IRL: 'IE', ISR: 'IL',
  ITA: 'IT', JAM: 'JM', JPN: 'JP', JOR: 'JO', KAZ: 'KZ', KEN: 'KE', KOR: 'KR', KWT: 'KW', KGZ: 'KG',
  LAO: 'LA', LVA: 'LV', LBN: 'LB', LSO: 'LS', LBR: 'LR', LBY: 'LY', LIE: 'LI', LTU: 'LT', LUX: 'LU',
  MAC: 'MO', MKD: 'MK', MDG: 'MG', MWI: 'MW', MYS: 'MY', MDV: 'MV', MLI: 'ML', MLT: 'MT', MRT: 'MR',
  MUS: 'MU', MEX: 'MX', MDA: 'MD', MCO: 'MC', MNG: 'MN', MNE: 'ME', MAR: 'MA', MOZ: 'MZ', MMR: 'MM',
  NAM: 'NA', NPL: 'NP', NLD: 'NL', NZL: 'NZ', NIC: 'NI', NER: 'NE', NGA: 'NG', NOR: 'NO', OMN: 'OM',
  PAK: 'PK', PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH', POL: 'PL', PRT: 'PT', PRI: 'PR',
  QAT: 'QA', ROU: 'RO', RUS: 'RU', RWA: 'RW', KNA: 'KN', LCA: 'LC', SRB: 'RS', SAU: 'SA', SEN: 'SN',
  SLE: 'SL', SGP: 'SG', SXM: 'SX', SVK: 'SK', SVN: 'SI', SOM: 'SO', ZAF: 'ZA', SSD: 'SS', ESP: 'ES',
  LKA: 'LK', SDN: 'SD', SUR: 'SR', SWE: 'SE', CHE: 'CH', SYR: 'SY', TWN: 'TW', TJK: 'TJ', TZA: 'TZ',
  THA: 'TH', TLS: 'TL', TGO: 'TG', TTO: 'TT', TUN: 'TN', TUR: 'TR', TKM: 'TM', UGA: 'UG', UKR: 'UA',
  ARE: 'AE', GBR: 'GB', USA: 'US', URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE', VNM: 'VN', YEM: 'YE',
  ZMB: 'ZM', ZWE: 'ZW',
  // Add more mappings if needed based on your data
  // Use the 'properties' object in onPolygonClick callback to identify the correct code
};

interface InteractiveGlobeProps {
  onCountrySelect: (countryCode: string) => void;
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ onCountrySelect }) => {
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] });
  const [hoverD, setHoverD] = useState<any>();
  const globeRef = useRef<GlobeMethods | undefined>();

  useEffect(() => {
    // Load country polygons data from a source with CORS headers
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => {
          // Check if the response was successful
          if (!res.ok) {
             throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
      })
      .then(data => {
          setCountries(data);
          // Auto-rotate initially
           if (globeRef.current) {
             globeRef.current.controls().autoRotate = true;
             globeRef.current.controls().autoRotateSpeed = 0.2;
           }
      })
      .catch(err => console.error('Error loading country polygons:', err));
  }, []);

  // Memoize color calculation function
  const colorScale = useMemo(() => (feature: any) => {
      // Simple alternating color scheme for visualization
      // You could base this on data later if needed
      const index = countries.features.indexOf(feature);
      return index % 2 === 0 ? 'rgba(0, 100, 255, 0.7)' : 'rgba(0, 200, 100, 0.7)';
  }, [countries]);

  const handlePolygonClick = (polygon: any, event: MouseEvent) => {
     // Remove debugging logs
     // console.log("handlePolygonClick triggered!"); 
     // console.log("Clicked polygon object:", polygon);
     // console.log('Clicked Polygon Properties:', polygon.properties);

     if (!polygon || !polygon.properties) {
       console.error('Clicked object is not a valid polygon with properties.');
       return;
     }

     const isoA3 = polygon.properties.ISO_A3_EH || 
                   polygon.properties.ADM0_A3 ||   
                   polygon.properties.GU_A3 ||
                   polygon.properties.SU_A3 ||
                   polygon.properties.ISO_A3 ||    
                   polygon.properties.SOVEREIGNT; 
                   
     const countryCodeA2 = isoA3 ? isoA3ToA2[isoA3] : null;

     if (countryCodeA2) {
       console.log(`Selected Country: ${isoA3} -> ${countryCodeA2}`);
       onCountrySelect(countryCodeA2);

       // Temporarily comment out the pointOfView animation
       /*
       if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = false; // Stop rotation on click
            
            // Zoom slightly less aggressively
            globeRef.current.pointOfView({ 
                lat: polygon.properties.LABEL_Y, 
                lng: polygon.properties.LABEL_X, 
                altitude: 2 // Adjusted altitude 
            }, 1000); // 1 second transition
       }
       */
     } else {
       console.warn('Could not map clicked country to A2 code:', isoA3);
     }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
         <Globe
             ref={globeRef}
             // Globe Image
             globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
             // Starry background
             // You might need to install or find a starry background image
             backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png" 
             
             // Countries Layer
             polygonsData={countries.features}
             polygonAltitude={0.01} // Slight lift
             polygonCapColor={d => d === hoverD ? 'rgba(0, 255, 0, 0.8)' : 'rgba(200, 200, 200, 0.5)'}
             polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
             polygonStrokeColor={() => '#111'}
             // polygonLabel={({ properties: d }) => `<b>${d.ADMIN}</b> (${d.ISO_A2})`}
             onPolygonHover={setHoverD}
             polygonsTransitionDuration={300}
             onPolygonClick={handlePolygonClick}
             // Add polygonLabel for tooltip - Use a less strict type
             polygonLabel={(feature: any) => `
               <div style="background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                 <b>${feature.properties.ADMIN || feature.properties.SOVEREIGNT || 'Country'}</b>
               </div>
             `}
         />
     </div>
  );
};

export default InteractiveGlobe; 