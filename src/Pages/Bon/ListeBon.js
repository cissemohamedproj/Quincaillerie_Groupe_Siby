import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';

import { useAllBon, useDeleteBon } from '../../Api/queriesBon';
import {
  connectedUserBoutique,
  connectedUserRole,
} from '../Authentication/userInfos';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import FormModal from '../components/FormModal';
import BonForm from './BonForm';
import BonFacture from './BonFacture';

export default function ListeBon({ id, commandeItems }) {
  const [form_modal, setForm_modal] = useState(false);
  // Récupération des Historiques de Bon
  const { data: bonData, isLoading, error } = useAllBon(id);

  // State pour supprimer le Bon
  const { mutate: deleteBon, isDeleting } = useDeleteBon();

  const [bonToUpdate, setBonToUpdate] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [facture_modal, setFacture_modal] = useState(false);
  const [selectedBon, setSelectedBon] = useState([]);
  // Ouverture de Modal Form
  function tog_form_modal() {
    setForm_modal(!form_modal);
  }

  // Ouverture de Modal Form
  function tog_facture_modal() {
    setFacture_modal(!facture_modal);
  }
  // State de Recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de Rechercher
  const filterSearchBon = bonData?.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item?.product?.toLowerCase().includes(search) ||
      (item?.totalAmount || 0).toString().includes(search) ||
      new Date(item?.bonDate).toLocaleDateString('fr-Fr').includes(search)
    );
  });

  // ------------------------------------------------

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // ---------------------------------------
  // ---------------------------------------
  // ---------------------------------------
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          {/* -------------------------- */}
          <BonFacture
            tog_show_modal={setFacture_modal}
            show_modal={facture_modal}
            selectedBon={selectedBon}
          />
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formTitle}
            size='md'
            bodyContent={
              <BonForm
                selectedBonToUpdate={bonToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardTitle className='text-center mb-4 mt-2 font-size-20 '>
                  Bon de Réceptions
                </CardTitle>
                <CardBody>
                  <div id='BonList'>
                    <Row className='g-4 mb-3 justify-content-between align-items-center'>
                      <Col className='col-sm-auto '>
                        <div className='d-flex gap-2'>
                          <Button
                            color='secondary'
                            onClick={() => {
                              setFacture_modal(true);
                              tog_facture_modal();
                            }}
                          >
                            <i className='bx bx-show align-center'></i> Facture
                          </Button>
                          <Button
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setBonToUpdate(null);
                              setFormTitle('Créer un Bon de Réception');
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-plus align-center me-1'></i>{' '}
                            Créer un Bon de Réception
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm-auto'>
                        <div className='d-flex justify-content-sm-end gap-2'>
                          {searchTerm !== '' && (
                            <Button
                              color='danger'
                              onClick={() => setSearchTerm('')}
                            >
                              <i className='fas fa-window-close'></i>
                            </Button>
                          )}
                          <div className='search-box me-4'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {/* Liste Historique de Paiement si ça existe */}
                      {!error && !isLoading && filterSearchBon?.length > 0 && (
                        <table
                          className='table align-middle  border-all border-2 border-secondary table-nowrap table-hover text-center'
                          id='bonDataItems'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th></th>
                              <th style={{ width: '50px' }}>Date</th>

                              <th className='text-center' data-sort='totaPayer'>
                                Produit
                              </th>

                              <th>Quantité</th>
                              <th>Prix unitaire</th>
                              <th>Total</th>
                              <th>Fournisseur</th>
                              <th>Contact</th>
                              {connectedUserRole === 'admin' &&
                                connectedUserBoutique ===
                                  commandeItems?.user?.boutique && (
                                  <th data-sort='action'>Action</th>
                                )}
                            </tr>
                          </thead>

                          <tbody className='list form-check-all'>
                            {filterSearchBon?.length > 0 &&
                              filterSearchBon?.map((item) => {
                                const categoryType =
                                  item.category === 'Carreaux';
                                return (
                                  <tr key={item?._id}>
                                    <th scope='row'>
                                      <input
                                        type='checkbox'
                                        checked={selectedBon.some(
                                          (b) => b._id === item._id
                                        )}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            // Ajouter l’item
                                            setSelectedBon((prev) => [
                                              ...prev,
                                              item,
                                            ]);
                                          } else {
                                            // Retirer l’item
                                            setSelectedBon((prev) =>
                                              prev.filter(
                                                (b) => b._id !== item._id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </th>
                                    <th>
                                      {new Date(
                                        item?.bonDate
                                      ).toLocaleDateString()}
                                    </th>

                                    <td>{capitalizeWords(item?.product)}</td>

                                    <td>
                                      {item?.quantity} {item.qtyType}
                                      {categoryType && (
                                        <p>
                                          {item?.cartons} cartons et{' '}
                                          {item?.piecesSup > 0 &&
                                            item?.piecesSup}{' '}
                                          pièces
                                        </p>
                                      )}
                                    </td>

                                    <td>{formatPrice(item?.price)} F </td>
                                    <td>{formatPrice(item?.totalAmount)} F </td>
                                    <td>
                                      {capitalizeWords(item.fournisseur)}{' '}
                                    </td>
                                    <td>
                                      <p>{capitalizeWords(item.adresse)}</p>{' '}
                                      <p>{formatPhoneNumber(item.contact)}</p>{' '}
                                    </td>
                                    {connectedUserRole === 'admin' &&
                                      connectedUserBoutique ===
                                        commandeItems?.user?.boutique && (
                                        <td>
                                          {isDeleting && <LoadingSpiner />}
                                          {!isDeleting && (
                                            <div className='d-flex gap-2 justify-content-center alitgn-items-center'>
                                              <div>
                                                <button
                                                  className='btn btn-sm btn-warning show-item-btn'
                                                  onClick={() => {
                                                    setBonToUpdate(item);
                                                    setFormTitle(
                                                      'Modifier le Bon de Réception'
                                                    );
                                                    tog_form_modal();
                                                  }}
                                                >
                                                  <i className='bx bx-pencil align-center text-white'></i>
                                                </button>
                                              </div>

                                              <div className='remove'>
                                                <button
                                                  className='btn btn-sm btn-danger remove-item-btn'
                                                  onClick={() => {
                                                    deleteButton(
                                                      item?._id,
                                                      item?.product,
                                                      deleteBon
                                                    );
                                                  }}
                                                >
                                                  <i className='ri-delete-bin-fill text-white'></i>
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </td>
                                      )}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
