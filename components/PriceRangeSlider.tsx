

import React, { useCallback, useEffect, useRef } from 'react';
import { useCurrency } from '../hooks/useCurrency';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
  step?: number;
  disabled?: boolean;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, value, onChange, step = 1, disabled = false }) => {
  const { formatPrice } = useCurrency();
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Update slider range bar style when value changes
  useEffect(() => {
    // Check for max > min to avoid division by zero
    if (max > min) {
      const minPercent = getPercent(value.min);
      const maxPercent = getPercent(value.max);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [value, getPercent, min, max]);


  return (
    <div className={`pt-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative h-8 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          disabled={disabled}
          onChange={(event) => {
            const newMinVal = Math.min(Number(event.target.value), value.max - step);
            onChange({ ...value, min: newMinVal });
          }}
          className="thumb thumb--left"
          style={{ zIndex: value.min > max - 100 ? 5 : undefined }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          disabled={disabled}
          onChange={(event) => {
            const newMaxVal = Math.max(Number(event.target.value), value.min + step);
            onChange({ ...value, max: newMaxVal });
          }}
          className="thumb thumb--right"
          aria-label="Maximum price"
        />
        <div className="relative w-full h-1.5">
          <div className="absolute rounded-lg h-1.5 bg-gray-300 w-full z-1" />
          <div ref={range} className="absolute rounded-lg h-1.5 bg-halal-green z-2" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 text-sm font-medium text-gray-700">
        <span aria-label={`Current minimum price: ${formatPrice(value.min)}`}>{formatPrice(value.min)}</span>
        <span aria-label={`Current maximum price: ${formatPrice(value.max)}`}>{formatPrice(value.max)}</span>
      </div>
       <style>{`
          .thumb {
            pointer-events: none;
            position: absolute;
            height: 0;
            width: 100%;
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background: transparent;
          }

          .thumb::-webkit-slider-thumb {
            pointer-events: all;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid #1E7145;
            cursor: pointer;
            margin-top: -8px; 
            position: relative;
            z-index: 3;
          }

          .thumb::-moz-range-thumb {
            pointer-events: all;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid #1E7145;
            cursor: pointer;
            position: relative;
            z-index: 3;
          }

          .thumb:disabled::-webkit-slider-thumb {
            cursor: not-allowed;
            border-color: #9ca3af; /* gray-400 */
          }
          .thumb:disabled::-moz-range-thumb {
            cursor: not-allowed;
            border-color: #9ca3af; /* gray-400 */
          }
        `}</style>
    </div>
  );
};

export default PriceRangeSlider;