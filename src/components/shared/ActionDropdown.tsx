import React, { useEffect } from "react";
import { SvgIcon } from "./SvgIcon";
import type { SvgIconName } from "@/types/shared";

export interface ActionItem {
  label: string;
  icon?: SvgIconName;
  onClick: () => void;
  disabled?: boolean;
  show?: boolean;
}

interface ActionDropdownProps {
  items: ActionItem[];
  disabled?: boolean;
  triggerIcon?: React.ReactNode;
  className?: string;
}

export const ActionDropdown = ({ 
  items, 
  disabled = false, 
  triggerIcon,
  className = "" 
}: ActionDropdownProps) => {
  
  useEffect(() => {
    const closeAllDropdowns = () => {
      const dropdowns = document.querySelectorAll('.action-dropdown.opacity-100');
      dropdowns.forEach(dropdown => {
        dropdown.classList.add('opacity-0', 'invisible');
        dropdown.classList.remove('opacity-100', 'visible');
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.action-dropdown.opacity-100');
      const target = event.target as Node;
      
      dropdowns.forEach(dropdown => {
        const isClickOutside = !dropdown.contains(target);
        const isClickOnButton = (target as Element)?.closest?.('button[data-action-dropdown-toggle]');
        
        if (isClickOutside && !isClickOnButton) {
          dropdown.classList.add('opacity-0', 'invisible');
          dropdown.classList.remove('opacity-100', 'visible');
        }
      });
    };

    const handleScroll = () => {
      closeAllDropdowns();
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', closeAllDropdowns);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', closeAllDropdowns);
    };
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const dropdown = button.nextElementSibling as HTMLElement;
    
    document.querySelectorAll('.action-dropdown.opacity-100').forEach(d => {
      if (d !== dropdown) {
        d.classList.add('opacity-0', 'invisible');
        d.classList.remove('opacity-100', 'visible');
      }
    });
    
    if (dropdown.classList.contains('opacity-0')) {
      const buttonRect = button.getBoundingClientRect();
      const dropdownWidth = 192; // w-48
      
      const left = Math.max(10, buttonRect.right - dropdownWidth);
      const top = buttonRect.bottom + 4;
      
      dropdown.style.left = `${left}px`;
      dropdown.style.top = `${top}px`;
      
      dropdown.classList.remove('opacity-0', 'invisible');
      dropdown.classList.add('opacity-100', 'visible');
    } else {
      dropdown.classList.add('opacity-0', 'invisible');
      dropdown.classList.remove('opacity-100', 'visible');
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    const dropdown = e.currentTarget.closest('.py-2')?.parentElement as HTMLElement;
    if (dropdown) {
      dropdown.classList.add('opacity-0', 'invisible');
      dropdown.classList.remove('opacity-100', 'visible');
    }
  };

  const visibleItems = items.filter(item => item.show !== false);
  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleDropdownToggle}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        disabled={disabled}
        data-action-dropdown-toggle
      >
        {triggerIcon || (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="3" r="1.5" fill="#667185" />
            <circle cx="8" cy="8" r="1.5" fill="#667185" />
            <circle cx="8" cy="13" r="1.5" fill="#667185" />
          </svg>
        )}
      </button>
      
      <div 
        className="action-dropdown fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible transition-all duration-200"
        style={{
          zIndex: 9999,
          left: 'auto',
          right: 'auto',
          top: 'auto',
          bottom: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {visibleItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => handleActionClick(e, item.onClick)}
              disabled={item.disabled}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {item.icon && (
                <SvgIcon 
                  name={item.icon} 
                  width={16} 
                  height={16} 
                  fill="#667185" 
                  className={item.icon === "angle-left" ? "rotate-180" : undefined}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 