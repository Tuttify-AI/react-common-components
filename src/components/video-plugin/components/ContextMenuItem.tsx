import * as React from 'react';
import { Component } from 'react';

interface ContextMenuItemProps {
  title: string;
  id: string;
  onClick: (e) => void;
  highlighted: boolean;
  disabled?: boolean;
}

export class ContextMenuItem extends Component<ContextMenuItemProps, Record<string, never>> {
  render() {
    const { highlighted, id, disabled } = this.props;

    return (
      <div
        id={id}
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          if (disabled) {
            return;
          }
          this.props.onClick(e);
        }}
        className={highlighted ? undefined : 'menu-item'}
        style={{
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          paddingLeft: '5px',
          paddingRight: '5px',
          fontSize: '14px',
          cursor: 'pointer',
          paddingTop: '2px',
          paddingBottom: '2px',
          backgroundColor: highlighted ? 'rgb(208, 217, 219)' : undefined,
        }}
      >
        <div
          style={{
            color: disabled ? 'rgba(70,70,70,0.3)' : 'rgba(70,70,70,1)',
          }}
        >
          {this.props.title}
        </div>
      </div>
    );
  }
}
