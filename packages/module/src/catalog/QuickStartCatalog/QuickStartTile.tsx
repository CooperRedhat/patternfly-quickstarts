import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import RocketIcon from '@patternfly/react-icons/dist/js/icons/rocket-icon';
import { FallbackImg } from '@console/shared';
import { QuickStartContext, QuickStartContextValues } from '../../utils/quick-start-context';
import { QuickStart, QuickStartStatus } from '../../utils/quick-start-types';
import { camelize } from '../../utils/quick-start-utils';
import QuickStartTileDescription from './QuickStartTileDescription';
import QuickStartTileFooter from './QuickStartTileFooter';
import QuickStartTileFooterExternal from './QuickStartTileFooterExternal';
import QuickStartTileHeader from './QuickStartTileHeader';

import './QuickStartTile.scss';
import { Card } from '@patternfly/react-core';

type QuickStartTileProps = {
  quickStart: QuickStart;
  status: QuickStartStatus;
  isActive: boolean;
  onClick?: () => void;
  isLearningPath?: boolean;
};

const QuickStartTile: React.FC<QuickStartTileProps> = ({
  quickStart,
  status,
  isActive,
  onClick = () => {},
  isLearningPath,
}) => {
  const {
    metadata: { name: id },
    spec: { icon, tasks, displayName, description, durationMinutes, prerequisites, link, type },
  } = quickStart;

  const { setActiveQuickStart, footer } = React.useContext<QuickStartContextValues>(
    QuickStartContext,
  );

  const ref = React.useRef<HTMLDivElement>(null);

  let quickStartIcon: React.ReactNode;
  if (typeof icon === 'object') {
    quickStartIcon = icon;
  } else {
    quickStartIcon = (
      <FallbackImg
        className="pfext-catalog-item-icon__img--large"
        src={icon as string}
        alt=""
        fallback={<RocketIcon />}
      />
    );
  }

  const footerComponent =
    footer && footer.show === false ? null : link ? (
      <QuickStartTileFooterExternal link={link} quickStartId={id} />
    ) : (
      <QuickStartTileFooter quickStartId={id} status={status} totalTasks={tasks?.length} />
    );

  const handleClick = (e: React.SyntheticEvent<HTMLElement, Event>) => {
    if (ref.current?.contains(e.target as Node)) {
      if (link) {
        window.open(link.href);
      } else {
        setActiveQuickStart(id, tasks?.length);
      }
      onClick();
    }
  };

  const offset = 10;
  const lpTileContainerStyle = {
    position: 'relative',
    zIndex: 1,
    margin: `0 ${offset}px ${offset}px 0`,
  };
  const lpBottomCardStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0px',
    top: '0px',
    height: '100%',
    width: '100%',
    zIndex: -1,
    transform: `translate(${offset}px, ${offset}px)`,
  };
  const containerStyle = isLearningPath ? lpTileContainerStyle : {};

  return (
    <div ref={ref} style={containerStyle}>
      <CatalogTile
        // @ts-ignore
        component="div"
        style={{
          cursor: 'pointer',
        }}
        icon={quickStartIcon}
        className="pfext-quick-start-tile"
        data-testid={`qs-card-${camelize(displayName)}`}
        featured={isActive}
        title={
          <QuickStartTileHeader
            name={displayName}
            status={status}
            duration={durationMinutes}
            type={type}
            quickStartId={id}
          />
        }
        onClick={handleClick}
        data-test={`tile ${id}`}
        description={
          <QuickStartTileDescription description={description} prerequisites={prerequisites} />
        }
        footer={footerComponent}
      />
      {isLearningPath && <Card isFlat style={lpBottomCardStyle} />}
    </div>
  );
};

export default QuickStartTile;