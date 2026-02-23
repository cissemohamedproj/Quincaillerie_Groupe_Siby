import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { companyName } from '../CompanyInfo/CompanyInfo';
import {
  useAllCommandes,
  usePagignationCommandes,
} from '../../Api/queriesCommande';

import html2pdf from 'html2pdf.js';
import { useReactToPrint } from 'react-to-print';
import FactureHeader from './Details/FactureHeader';
import LogoFiligran from './Details/LogoFiligran';
import { connectedUserBoutique } from '../Authentication/userInfos';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';

// Export En PDF
// ------------------------------------------
// ------------------------------------------
const exportPDFFacture = () => {
  const element = document.getElementById('facture');
  const opt = {
    filename: 'facture.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .catch((err) => console.error('Error generating PDF:', err));
};

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
export default function SelectedFacture() {
  const { id } = useParams();
  const { data: commandes, isLoading, error } = useAllCommandes();
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Fonction de Recherche dans la barre de recherche
  const selectedCommande = commandes?.factures?.find((item) => item._id === id);

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Commande' breadcrumbItem='Liste de Factures' />
          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}
          {!isLoading && !error && (
            <Row className='d-flex flex-column justify-content-center'>
              {/* // Bouton */}
              <Col className='col-sm-auto'>
                <BackButton />
                <div className='d-flex gap-4 mb-3  justify-content-center align-items-center'>
                  <Button
                    color='info'
                    className='add-btn'
                    id='create-btn'
                    onClick={reactToPrintFn}
                  >
                    <i className='fas fa-print align-center me-1'></i> Imprimer
                  </Button>

                  <Button color='danger' onClick={exportPDFFacture}>
                    <i className='fas fa-paper-plane  me-1 '></i>
                    Télécharger en PDF
                  </Button>
                </div>
              </Col>
              {/* // ------------------------------------------- */}

              <div ref={contentRef}>
                <Card
                  id='facture'
                  className='d-flex justify-content-center border border-info'
                  style={{
                    boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                    borderRadius: '15px',
                    width: '560px',
                    margin: '20px auto',
                    position: 'relative',
                  }}
                >
                  <CardBody>
                    <FactureHeader />
                    <div className='border-bottom border-info my-2 px-2 '>
                      <div className='d-flex justify-content-between align-item-center mt-2'>
                        <CardText>
                          <strong>Facture N°: </strong>{' '}
                          <span className='text-danger'>
                            {selectedCommande?.commande?.commandeId}{' '}
                          </span>
                        </CardText>
                        <CardText>
                          <strong> Date:</strong>{' '}
                          {new Date(
                            selectedCommande?.commande?.commandeDate
                          ).toLocaleDateString()}
                        </CardText>
                      </div>

                      {/* Infos Client */}
                      <div className='d-flex justify-content-between align-item-center  '>
                        <CardText>
                          <strong>Client: </strong>
                          {capitalizeWords(
                            selectedCommande?.commande?.fullName
                          )}{' '}
                        </CardText>
                        <CardText className='me-2'>
                          <strong>Tél: </strong>
                          {formatPhoneNumber(
                            selectedCommande?.commande?.phoneNumber
                          ) || '-----'}
                        </CardText>
                      </div>
                      <CardText className='text-start'>
                        <strong>Livraison: </strong>
                        {capitalizeWords(selectedCommande?.commande?.adresse)}
                      </CardText>
                    </div>
                    {/* Bordure Séparateur */}

                    {/* Logo Filigran */}
                    <LogoFiligran />

                    <div className='my-2 p-2'>
                      <table className='table align-middle table-nowrap table-hover table-bordered border-2 border-info text-center'>
                        <thead>
                          <tr>
                            <th>Qté</th>
                            <th>Désignations</th>
                            <th>P.U</th>
                            <th>Montant</th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedCommande?.commande?.items.map((article) => (
                            <tr key={article._id}>
                              <td>{article?.quantity} </td>
                              <td className='text-wrap'>
                                {capitalizeWords(article?.produit?.name)}{' '}
                              </td>
                              <td>{formatPrice(article?.customerPrice)} F </td>
                              <td>
                                {formatPrice(
                                  article?.customerPrice * article?.quantity
                                )}
                                {' F'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <CardFooter>
                      <div className='p-1'>
                        <div
                          className='d-flex
                  justify-content-between align-item-center'
                        >
                          <div>
                            <CardText className={'text-center'}>
                              Montant:{' '}
                              <strong style={{ fontSize: '14px' }}>
                                {' '}
                                {formatPrice(
                                  selectedCommande?.totalAmount
                                )} F{' '}
                              </strong>{' '}
                            </CardText>
                            {selectedCommande?.commande?.sheepingFee > 0 && (
                              <div>
                                {' '}
                                <CardText className={'text-center'}>
                                  Livraison:{' '}
                                  <strong style={{ fontSize: '14px' }}>
                                    {' '}
                                    {formatPrice(
                                      selectedCommande?.commande?.sheepingFee
                                    )}{' '}
                                    F{' '}
                                  </strong>{' '}
                                </CardText>
                                <CardText className={'text-center'}>
                                  Total:{' '}
                                  <strong style={{ fontSize: '14px' }}>
                                    {' '}
                                    {formatPrice(
                                      selectedCommande?.totalAmount +
                                        selectedCommande?.commande?.sheepingFee
                                    )}{' '}
                                    F{' '}
                                  </strong>{' '}
                                </CardText>{' '}
                              </div>
                            )}
                          </div>
                          <div>
                            <CardText className='text-center '>
                              Payé:
                              <strong style={{ fontSize: '14px' }}>
                                {' '}
                                {formatPrice(
                                  selectedCommande?.totalPaye
                                )} F{' '}
                              </strong>{' '}
                            </CardText>
                            <CardText className='text-center '>
                              Reliquat:
                              <strong style={{ fontSize: '14px' }}>
                                {' '}
                                {formatPrice(
                                  selectedCommande?.totalAmount -
                                    selectedCommande?.totalPaye
                                )}{' '}
                                F{' '}
                              </strong>
                            </CardText>
                          </div>
                        </div>
                      </div>
                      <p className=' mt-2 text-info'>
                        Arrêté la présente facture à la somme de:{' '}
                        <strong style={{ fontSize: '14px' }}>
                          {formatPrice(selectedCommande?.totalAmount)} F
                        </strong>
                      </p>
                      <p className='font-size-10 text-center'>
                        Merci pour votre confiance et votre achat chez{' '}
                        {companyName}. Nous espérons vous revoir bientôt!
                      </p>
                    </CardFooter>
                  </CardBody>
                </Card>
              </div>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
}
