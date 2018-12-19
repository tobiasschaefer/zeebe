import React from 'react';
import {Button, Icon, ConfirmationModal, Message, LoadingIndicator} from 'components';

import AlertModal from './subComponents/AlertModal';

import {withErrorHandling} from 'HOC';
import {formatters} from 'services';

import './Alerts.scss';
import entityIcons from './entityIcons';

import {loadAlerts, loadReports, updateAlert, createAlert, deleteAlert} from './service';
import LastModified from './subComponents/LastModified';
import NoEntities from './subComponents/NoEntities';

const HeaderIcon = entityIcons.alert.header.Component;
const EntityIcon = entityIcons.alert.generic.Component;

const {duration, frequency} = formatters;

class Alerts extends React.Component {
  state = {
    reports: null,
    editEntity: null,
    loading: true,
    entities: [],
    deleting: false
  };

  loadAlerts = async () => {
    this.props.mightFail(loadAlerts(), response => {
      this.setState({
        entities: response,
        loading: false
      });
    });
  };

  componentDidMount = async () => {
    this.loadAlerts();
    const reports = (await loadReports()).filter(
      ({data: {visualization}}) => visualization === 'number'
    );
    this.setState({
      reports
    });
  };

  showDeleteModalFor = alert => () => this.setState({deleting: alert});
  hideDeleteModal = () => this.setState({deleting: false});

  deleteAlert = () => {
    deleteAlert(this.state.deleting.id);
    this.setState(({entities, deleting}) => {
      return {
        entities: entities.filter(entity => entity !== deleting),
        deleting: false
      };
    });
  };

  renderMetadata = alert => {
    if (!this.state.reports) return;
    const report = this.state.reports.find(({id}) => alert.reportId === id);
    return (
      <span className="metadata">
        Alert <span className="highlight">{alert.email}</span> when Report{' '}
        <span className="highlight">{report.name}</span> has a value{' '}
        <span className="highlight">
          {alert.thresholdOperator === '<' ? 'below ' : 'above '}
          {report.data.view.property === 'duration'
            ? duration(alert.threshold)
            : frequency(alert.threshold)}
        </span>
      </span>
    );
  };

  showEditModalFor = alert => () => {
    this.setState({editEntity: alert});
  };
  showCreateModal = this.showEditModalFor({});
  closeEditModal = () => this.setState({editEntity: null});

  updateOrCreateAlert = async entity => {
    const editEntity = this.state.editEntity;
    if (editEntity.id) {
      await updateAlert(editEntity.id, entity);
    } else {
      await createAlert(entity);
    }
    this.closeEditModal();

    this.loadAlerts();
  };

  render() {
    const {reports} = this.state;

    const EditModal = this.state.editEntity && AlertModal(reports);

    const error = this.props.error && (
      <Message type="error">{this.props.error.errorMessage || this.props.error.statusText}</Message>
    );

    const loading = this.state.loading && <LoadingIndicator />;

    const empty = !loading &&
      this.state.entities.length === 0 && (
        <NoEntities label="Alert" createFunction={this.showCreateModal} />
      );

    return (
      <div className="Alerts">
        <h1>
          <HeaderIcon /> Alerts
        </h1>
        <Button color="green" className="createButton" onClick={this.showCreateModal}>
          Create New Alert
        </Button>
        {error}
        {loading}
        <ul className="entityList">
          {empty}
          {this.state.entities.map((itemData, idx) => (
            <li key={idx}>
              <span className="info" onClick={this.showEditModalFor(itemData)}>
                <span className="icon">
                  <EntityIcon />
                </span>
                <div className="textInfo">
                  <div className="data dataTitle">
                    <h3>{itemData.name}</h3>
                  </div>
                  <div className="extraInfo">
                    <span className="data custom">{this.renderMetadata(itemData)}</span>
                    <LastModified date={itemData.lastModified} author={itemData.lastModifier} />
                  </div>
                </div>
              </span>
              <div className="operations">
                <Button title="Edit Alert" onClick={this.showEditModalFor(itemData)}>
                  <Icon title="Edit Alert" type="edit" className="editLink" />
                </Button>
                <Button title="Delete Alert" onClick={this.showDeleteModalFor(itemData)}>
                  <Icon type="delete" title="Delete Alert" className="deleteIcon" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <ConfirmationModal
          open={this.state.deleting !== false}
          onClose={this.hideDeleteModal}
          onConfirm={this.deleteAlert}
          entityName={this.state.deleting && this.state.deleting.name}
        />
        {EditModal && (
          <EditModal
            onConfirm={this.updateOrCreateAlert}
            onClose={this.closeEditModal}
            entity={this.state.editEntity}
          />
        )}
      </div>
    );
  }
}

export default withErrorHandling(Alerts);
