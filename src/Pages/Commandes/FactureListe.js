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
import { useNavigate } from 'react-router-dom';

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
export default function FactureListe() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 30;
  const {
    data: commandes,
    isLoading,
    error,
  } = usePagignationCommandes(page, limit);
  const contentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  // Fonction de Recherche dans la barre de recherche
  const filterCommandesFacture = commandes?.factures?.data
    ?.filter((fac) => {
      const search = searchTerm.toLowerCase();
      return (
        fac?.commande?.fullName.toLowerCase().includes(search) ||
        fac?.commande?.phoneNumber.toString().includes(search) ||
        fac?.commande?.adresse.toLowerCase().includes(search) ||
        fac?.totalAmount?.toString().includes(search) ||
        fac?.totalPaye?.toString().includes(search) ||
        new Date(fac?.commande?.commandeDate || fac?.paiementDate)
          .toLocaleDateString('fr-FR')
          .includes(search)
      );
    })
    ?.filter((item) => {
      if (selectedBoutique !== null) {
        return Number(item.user?.boutique) === selectedBoutique;
      }
      return true;
    });
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Commande' breadcrumbItem='Liste de Factures' />

          {!isLoading && !error && (
            <Card className='p-4'>
              <div className=' d-flex align-items-center gap-3 mb-4 justify-content-between flex-wrap'>
                {/* Selectonner la boutique */}
                <div className='mb-3'>
                  <h6>Filtrer par Boutique </h6>
                  <select
                    value={selectedBoutique ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedBoutique(v === '' ? null : Number(v));
                    }}
                    className='form-select border border-dark rounded '
                    style={{ cursor: 'pointer' }}
                  >
                    <option value=''>Toutes</option>
                    <option value={connectedUserBoutique ?? 0}>
                      {connectedUserBoutique ?? 0} - Ma Boutique
                    </option>
                    {connectedUserBoutique === 1 ? (
                      <option value='2'>Boutique - 2</option>
                    ) : connectedUserBoutique === 2 ? (
                      <option value='1'>Boutique - 1</option>
                    ) : (
                      <optgroup label='autres'>
                        <option value='1'>Boutique - 1</option>
                        <option value='2'>Boutique - 2</option>
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className='search-box me-2 d-flex align-items-center gap-2'>
                  {searchTerm !== '' && (
                    <Button color='danger' onClick={() => setSearchTerm('')}>
                      <i className='fas fa-window-close'></i>
                    </Button>
                  )}
                  <input
                    type='text'
                    className='form-control search border border-dark rounded'
                    placeholder='Rechercher...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className='d-flex gap-3 justify-content-end align-items-center mt-4'>
                <Button
                  disabled={page === 1}
                  color='secondary'
                  onClick={() => setPage((p) => p - 1)}
                >
                  Précédent
                </Button>

                <p className='text-center mt-2'>
                  {' '}
                  Page{' '}
                  <span className='text-primary'>
                    {commandes?.factures?.page}
                  </span>{' '}
                  sur{' '}
                  <span className='text-info'>
                    {commandes?.factures?.totalPages}
                  </span>
                </p>
                <Button
                  disabled={page === commandes?.factures?.totalPages}
                  color='primary'
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </Card>
          )}
          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}
          {filterCommandesFacture?.length === 0 && !isLoading && (
            <div className='text-center text-secondary mt-4'>
              Aucune facture pour le moment.
            </div>
          )}
          {!error &&
            !isLoading &&
            filterCommandesFacture?.length > 0 &&
            filterCommandesFacture?.map((comm, index) => (
              <Row
                key={comm._id}
                className='d-flex flex-column justify-content-center'
              >
                {/* // Bouton */}
                <Col className='col-sm-auto mb-3'>
                  <div className='d-flex gap-4  justify-content-center align-items-center'>
                    <Button
                      color='info'
                      className='add-btn'
                      id='create-btn'
                      onClick={() =>
                        navigate(`/factures/selected_facture/${comm?._id}`)
                      }
                    >
                      <i className='bx bx-show align-center me-1'></i> Détails
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
                              {comm.commande?.commandeId}{' '}
                            </span>
                          </CardText>
                          <CardText>
                            <strong> Date:</strong>{' '}
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </CardText>
                        </div>

                        {/* Infos Client */}
                        <div className='d-flex justify-content-between align-item-center  '>
                          <CardText>
                            <strong>Client: </strong>
                            {capitalizeWords(comm?.commande?.fullName)}{' '}
                          </CardText>
                          <CardText className='me-2'>
                            <strong>Tél: </strong>
                            {formatPhoneNumber(comm?.commande?.phoneNumber) ||
                              '-----'}
                          </CardText>
                        </div>
                        <CardText className='text-start'>
                          <strong>Livraison: </strong>
                          {capitalizeWords(comm?.commande?.adresse)}
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
                            {comm?.commande?.items.map((article) => (
                              <tr key={article._id}>
                                <td>{article?.quantity} </td>
                                <td className='text-wrap'>
                                  {capitalizeWords(article?.produit?.name)}{' '}
                                </td>
                                <td>
                                  {formatPrice(article?.customerPrice)} F{' '}
                                </td>
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
                                  {formatPrice(comm?.totalAmount)} F{' '}
                                </strong>{' '}
                              </CardText>
                              {comm?.commande?.sheepingFee > 0 && (
                                <div>
                                  {' '}
                                  <CardText className={'text-center'}>
                                    Livraison:{' '}
                                    <strong style={{ fontSize: '14px' }}>
                                      {' '}
                                      {formatPrice(
                                        comm?.commande?.sheepingFee
                                      )}{' '}
                                      F{' '}
                                    </strong>{' '}
                                  </CardText>
                                  <CardText className={'text-center'}>
                                    Total:{' '}
                                    <strong style={{ fontSize: '14px' }}>
                                      {' '}
                                      {formatPrice(
                                        comm?.totalAmount +
                                          comm?.commande?.sheepingFee
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
                                  {formatPrice(comm?.totalPaye)} F{' '}
                                </strong>{' '}
                              </CardText>
                              <CardText className='text-center '>
                                Reliquat:
                                <strong style={{ fontSize: '14px' }}>
                                  {' '}
                                  {formatPrice(
                                    comm?.totalAmount - comm?.totalPaye
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
                            {comm?.commande?.sheepingFee > 0
                              ? formatPrice(
                                  comm?.totalAmount +
                                    comm?.commande?.sheepingFee
                                )
                              : formatPrice(comm?.totalAmount)}{' '}
                            F
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
            ))}
        </Container>
      </div>
    </React.Fragment>
  );
}
