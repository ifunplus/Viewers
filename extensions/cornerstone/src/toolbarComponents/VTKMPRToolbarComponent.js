import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ToolbarButton } from '@ohif/ui';
import { utils } from '@ohif/core';

const { studyMetadataManager } = utils;

let isVisible = true;

const _isDisplaySetReconstructable = (viewportSpecificData = {}, activeViewportIndex) => {
  if (!viewportSpecificData[activeViewportIndex]) {
    return false;
  };

  const { displaySetInstanceUid, studyInstanceUid } = viewportSpecificData[
    activeViewportIndex
  ];

  const studies = studyMetadataManager.all();

  const study = studies.find(
    study => study.studyInstanceUID === studyInstanceUid
  );

  if (!study) {
    return false;
  }

  const displaySet = study._displaySets.find(set => set.displaySetInstanceUid === displaySetInstanceUid);

  if (!displaySet) {
    return false;
  };

  return displaySet.isReconstructable;
};

function VTKMPRToolbarComponent({
  parentContext,
  toolbarClickCallback,
  button,
  activeButtons,
  isActive,
  className,
  extensionManager,
}) {
  const { id, label, icon } = button;
  const { viewportSpecificData, activeViewportIndex } = useSelector(state => {
    const { viewports = {} } = state;
    const { viewportSpecificData, activeViewportIndex } = viewports;

    return {
      viewportSpecificData,
      activeViewportIndex,
    }
  });

  const isDisplaySetReconstructable = _isDisplaySetReconstructable(
    viewportSpecificData,
    activeViewportIndex,
  );
  const isVTKExtensionRegistered = extensionManager.registeredExtensionIds.includes('vtk');

  isVisible = isDisplaySetReconstructable && isVTKExtensionRegistered;


  return (
    <React.Fragment>
      {isVisible && (
        <ToolbarButton
          key={id}
          label={label}
          icon={icon}
          onClick={evt => toolbarClickCallback(button, evt)}
          isActive={isActive}
        />
      )}
    </React.Fragment>
  );
}

VTKMPRToolbarComponent.propTypes = {
  parentContext: PropTypes.object.isRequired,
  toolbarClickCallback: PropTypes.func.isRequired,
  button: PropTypes.object.isRequired,
  activeButtons: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  extensionManager: PropTypes.object,
};

export default VTKMPRToolbarComponent;