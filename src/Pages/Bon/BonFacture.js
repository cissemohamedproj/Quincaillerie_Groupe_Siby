import { Button, Card, CardBody, CardTitle, Modal } from 'reactstrap';
import html2pdf from 'html2pdf.js';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import FactureHeader from '../Commandes/Details/FactureHeader';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';

const BonFacture = ({ show_modal, tog_show_modal, selectedBon }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPaiementToPDF = () => {
    const element = document.getElementById('bon_de_reception');
    const opt = {
      filename: 'bon_de_reception.pdf',
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

  const total = selectedBon?.reduce(
    (current, value) => (current += value.totalAmount),
    0
  );

  return (
    <Modal
      isOpen={show_modal}
      toggle={() => {
        tog_show_modal();
      }}
      size={'lg'}
      scrollable={true}
      centered={true}
    >
      {/* ---- Modal Header */}
      <div className='modal-header'>
        <div className='d-flex gap-1 justify-content-around align-items-center w-100'>
          <Button
            color='info'
            className='add-btn'
            id='create-btn'
            onClick={reactToPrintFn}
          >
            <i className='fas fa-print align-center me-1'></i> Imprimer
          </Button>

          <Button color='danger' onClick={exportPaiementToPDF}>
            <i className='fas fa-paper-plane  me-1 '></i>
            Télécharger en PDF
          </Button>
        </div>

        <button
          type='button'
          onClick={() => tog_show_modal()}
          className='close'
          data-dismiss='modal'
          aria-label='Close'
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className='modal-body' ref={contentRef} id='bon_de_reception'>
        <div className='mx-5 d-flex justify-content-center '>
          <Card
            style={{
              boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
              borderRadius: '15px',
              // width: '583px',
              // width: '783px',
              margin: '10px auto',
              position: 'relative',
            }}
          >
            <CardBody>
              <FactureHeader />

              <div
                className='border border-1 border-dark'
                style={{ width: '100%', height: '1px' }}
              ></div>
              <div className='text-center my-2'>
                <CardTitle>
                  {capitalizeWords('Situation des Articles :')}
                </CardTitle>
                <h5 className='my-4'>Total: {formatPrice(total)}F </h5>
              </div>

              <div className='table-responsive table-card mt-3 mb-1'>
                {/* Liste Historique de Paiement si ça existe */}
                <table
                  className='table align-middle font-size-10  border-all border-2 border-secondary table-nowrap table-hover text-center'
                  id='bonDataItems'
                >
                  <thead className='table-light'>
                    <tr>
                      <th style={{ width: '50px' }}>Date</th>

                      <th className='text-center' data-sort='totaPayer'>
                        Produit
                      </th>

                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                      <th>Fournisseur</th>
                      <th>Contact</th>
                    </tr>
                  </thead>

                  <tbody className='list form-check-all'>
                    {selectedBon?.map((item) => {
                      const categoryType = item.category === 'Carreaux';
                      return (
                        <tr key={item?._id}>
                          <th>
                            {new Date(item?.bonDate).toLocaleDateString()}
                          </th>

                          <td>{capitalizeWords(item?.product)}</td>

                          <td>
                            {item?.quantity} {item.qtyType}
                            {categoryType && (
                              <p>
                                {item?.cartons} cartons et{' '}
                                {item?.piecesSup > 0 && item?.piecesSup} pièces
                              </p>
                            )}
                          </td>

                          <td>{formatPrice(item?.price)} F </td>
                          <td>{formatPrice(item?.totalAmount)} F </td>
                          <td>{capitalizeWords(item.fournisseur)} </td>
                          <td>
                            <p>{capitalizeWords(item.adresse)}</p>{' '}
                            <p>{formatPhoneNumber(item.contact)}</p>{' '}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default BonFacture;
