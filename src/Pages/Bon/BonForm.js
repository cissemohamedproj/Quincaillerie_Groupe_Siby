import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useCreateBon, useUpdateBon } from '../../Api/queriesBon';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import { formatPrice } from '../components/capitalizeFunction';
import LoadingSpiner from '../components/LoadingSpiner';

const BonForm = ({ selectedBonToUpdate, tog_form_modal }) => {
  // Récuperation de ID dans URL en utilisant UsParams

  const [selectedCategory, setSelectedCategory] = useState();
  const [total, setTotal] = useState();
  // State pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);
  // Paiement Query pour créer la Paiement
  const { mutate: createBon } = useCreateBon();

  // Mettre à jours une Livraison
  const { mutate: updateBon } = useUpdateBon();

  // ------------------------------------------------------------------------
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      category: selectedBonToUpdate?.category || '',
      product: selectedBonToUpdate?.product || '',
      fournisseur: selectedBonToUpdate?.fournisseur || '',
      quantity: selectedBonToUpdate?.quantity || 0,
      qtyType: selectedBonToUpdate?.qtyType || 'Pièces',
      price: selectedBonToUpdate?.price || 0,
      cartons: selectedBonToUpdate?.cartons || 0,
      piecesSup: selectedBonToUpdate?.piecesSup || 0,
      contact: selectedBonToUpdate?.contact || 0,
      adresse: selectedBonToUpdate?.adresse || '',
      totalAmount: selectedBonToUpdate?.totalAmount || 0,
      bonDate:
        selectedBonToUpdate?.bonDate?.substring(0, 10) ||
        new Date().toISOString().substring(0, 10),
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Ce champ est obligatoire'),
      product: Yup.string().required('Ce champ est obligatoire'),
      fournisseur: Yup.string().required('Ce champ est obligatoire'),
      qtyType: Yup.string().required('Ce champ est obligatoire'),
      quantity: Yup.number().required('Ce champ est obligatoire'),
      price: Yup.number().required('Ce champ est obligatoire'),
      contact: Yup.number().required('Ce champ est obligatoire'),
      adresse: Yup.string().required('Ce champ est obligatoire'),
      totalAmount: Yup.number().required('Ce champ est obligatoire'),
      bonDate: Yup.date().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      // Si la méthode est pour mise à jour alors
      const bonDataLoaded = {
        ...values,
      };

      if (selectedBonToUpdate) {
        updateBon(
          {
            id: selectedBonToUpdate?._id,
            data: bonDataLoaded,
          },
          {
            onSuccess: () => {
              successMessageAlert('Mise à jour avec succès');
              setIsLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setIsLoading(false);
            },
          }
        );
      } else {
        // on ajoute le paiements dans l'historique
        createBon(values, {
          onSuccess: () => {
            successMessageAlert('Bon créé avec succès');
            setIsLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! une erreur est survenu lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        });
      }
      setTimeout(() => {
        if (isLoading) {
          errorMessageAlert('Une erreur est survenue. Veuillez réessayer !');
          setIsLoading(false);
        }
      }, 10000);
    },
  });

  useEffect(() => {
    // const quantity = validation.values.quantity;
    const cat = validation.values.category;
    if (!cat || cat !== 'Carreaux') {
      validation.setFieldValue('cartons', 0);
      validation.setFieldValue('piecesSup', 0);
    }

    setSelectedCategory(cat);
  }, [validation.values.category]);

  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------

  useEffect(() => {
    const qty = validation.values.quantity;
    const pr = validation.values.price;

    if (qty <= 0 || pr <= 0) {
      return setTotal(0);
    }

    const amount = Math.floor(qty * pr);
    validation.setFieldValue('totalAmount', amount);
    setTotal(amount);
  }, [validation.values.quantity, validation.values.price]);
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------

  // Affichage des champs de Formulaire
  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <Row>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='product'>Produit</Label>

            <Input
              name='product'
              type='text'
              placeholder='Produit'
              className='form-control border-1 border-dark'
              id='product'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.product || ''}
              invalid={
                validation.touched.product && validation.errors.product
                  ? true
                  : false
              }
            />

            {validation.touched.product && validation.errors.product ? (
              <FormFeedback type='invalid'>
                {validation.errors.product}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='category'>Categorie</Label>

            <Input
              name='category'
              type='select'
              placeholder='Séléectionner un type'
              className='form-control border-1 border-dark'
              id='category'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.category || ''}
              invalid={
                validation.touched.category && validation.errors.category
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner une Categorie</option>
              <option value='Autre'>Autre</option>
              <option value='Carreaux'>Carreaux</option>
              <option value='Décoration'>Décoration</option>
              <option value='Construction'>Construction</option>
              <option value='Plomberie'>Plomberie</option>
              <option value='Electricité'>Electricité</option>
              <option value='Mecanique'>Electronique</option>
            </Input>

            {validation.touched.category && validation.errors.category ? (
              <FormFeedback category='invalid'>
                {validation.errors.category}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <FormGroup className='mb-3'>
            <Label htmlFor='quantity'>
              Quantité{' '}
              {selectedCategory && selectedCategory === 'Carreaux' && ' en m²'}
            </Label>

            <Input
              name='quantity'
              type='number'
              placeholder='Quantité reçu'
              className='form-control border-1 border-dark'
              id='quantity'
              min={1}
              step={0.0001}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.quantity || 0}
              invalid={
                validation.touched.quantity && validation.errors.quantity
                  ? true
                  : false
              }
            />

            {validation.touched.quantity && validation.errors.quantity ? (
              <FormFeedback type='invalid'>
                {validation.errors.quantity}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>

        <Col sm={4}>
          <FormGroup className='mb-3'>
            <Label htmlFor='qtyType'>Type de Quantité</Label>

            <Input
              name='qtyType'
              type='select'
              placeholder='Prix unitaire'
              className='form-control border-1 border-dark'
              id='qtyType'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.qtyType || 0}
              invalid={
                validation.touched.qtyType && validation.errors.qtyType
                  ? true
                  : false
              }
            >
              {/* 'm²','Tonne','m','Rouleau','Boite','Seau','Sac','Pièces','Barre' */}
              <option value=''>Sélectionner un Type</option>
              <option value='m²'>m²</option>
              <option value='Tonne'>Tonne</option>
              <option value='m'>Métre</option>
              <option value='Rouleau'>Rouleau</option>
              <option value='Boite'>Boite</option>
              <option value='Seau'>Seau</option>
              <option value='Sac'>Sac</option>
              <option value='Pièces'>Pièces</option>
              <option value='Barre'>Barre</option>
            </Input>

            {validation.touched.qtyType && validation.errors.qtyType ? (
              <FormFeedback type='invalid'>
                {validation.errors.qtyType}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup className='mb-3'>
            <Label htmlFor='price'>Prix unitaire</Label>

            <Input
              name='price'
              type='number'
              placeholder='Prix unitaire'
              className='form-control border-1 border-dark'
              id='price'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.price || 0}
              invalid={
                validation.touched.price && validation.errors.price
                  ? true
                  : false
              }
            />

            {validation.touched.price && validation.errors.price ? (
              <FormFeedback type='invalid'>
                {validation.errors.price}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        {total > 0 && (
          <p className='text-center text-info'>
            {' '}
            Total: {formatPrice(total)}F{' '}
          </p>
        )}
      </Row>
      {selectedCategory && selectedCategory === 'Carreaux' && (
        <Row>
          <Col sm={6}>
            <FormGroup className='mb-3'>
              <Label htmlFor='cartons'>Cartons</Label>

              <Input
                name='cartons'
                type='number'
                placeholder='Entrez le nombre de cartons correspondant'
                className='form-control border-1 border-dark'
                id='cartons'
                min={0}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.cartons || 0}
                invalid={
                  validation.touched.cartons && validation.errors.cartons
                    ? true
                    : false
                }
              />

              {validation.touched.cartons && validation.errors.cartons ? (
                <FormFeedback type='invalid'>
                  {validation.errors.cartons}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup className='mb-3'>
              <Label htmlFor='piecesSup'>Pièces Supp</Label>

              <Input
                name='piecesSup'
                type='number'
                className='form-control border-1 border-dark'
                placeholder='Entrez le nombre des pièces supplémentaire'
                id='piecesSup'
                min={0}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.piecesSup || 0}
                invalid={
                  validation.touched.piecesSup && validation.errors.piecesSup
                    ? true
                    : false
                }
              />

              {validation.touched.piecesSup && validation.errors.piecesSup ? (
                <FormFeedback type='invalid'>
                  {validation.errors.piecesSup}
                </FormFeedback>
              ) : null}
            </FormGroup>
          </Col>
        </Row>
      )}
      <Row>
        <Col sm={12}>
          <FormGroup className='mb-3'>
            <Label htmlFor='totalAmount'>Montant Total</Label>

            <Input
              name='totalAmount'
              type='number'
              placeholder='Numéro de fournisseur'
              className='form-control border-1 border-dark'
              id='totalAmount'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.totalAmount || 0}
              invalid={
                validation.touched.totalAmount && validation.errors.totalAmount
                  ? true
                  : false
              }
            />

            {validation.touched.totalAmount && validation.errors.totalAmount ? (
              <FormFeedback type='invalid'>
                {validation.errors.totalAmount}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='fournisseur'>Fournisseur</Label>

            <Input
              name='fournisseur'
              type='text'
              placeholder='Nom et Prénom de fournisseur'
              className='form-control border-1 border-dark'
              id='fournisseur'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.fournisseur || ''}
              invalid={
                validation.touched.fournisseur && validation.errors.fournisseur
                  ? true
                  : false
              }
            />

            {validation.touched.fournisseur && validation.errors.fournisseur ? (
              <FormFeedback type='invalid'>
                {validation.errors.fournisseur}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='adresse'>Adresse de Fournisseur</Label>

            <Input
              name='adresse'
              type='text'
              placeholder='Adresse de fournisseur'
              className='form-control border-1 border-dark'
              id='adresse'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.adresse || ''}
              invalid={
                validation.touched.adresse && validation.errors.adresse
                  ? true
                  : false
              }
            />

            {validation.touched.adresse && validation.errors.adresse ? (
              <FormFeedback type='invalid'>
                {validation.errors.adresse}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='contact'>Contact</Label>

            <Input
              name='contact'
              type='number'
              placeholder='Numéro de fournisseur'
              className='form-control border-1 border-dark'
              id='contact'
              min={1}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.contact || 0}
              invalid={
                validation.touched.contact && validation.errors.contact
                  ? true
                  : false
              }
            />

            {validation.touched.contact && validation.errors.contact ? (
              <FormFeedback type='invalid'>
                {validation.errors.contact}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup className='mb-3'>
            <Label htmlFor='bonDate'>Date de Réception</Label>

            <Input
              name='bonDate'
              type='date'
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className='form-control border-1 border-dark'
              id='bonDate'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.bonDate || ''}
              invalid={
                validation.touched.bonDate && validation.errors.bonDate
                  ? true
                  : false
              }
            />
            {validation.touched.bonDate && validation.errors.bonDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.bonDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <div className='d-grid text-center mt-4'>
        {isLoading && <LoadingSpiner />}
        {!isLoading && (
          <Button color='success' type='submit'>
            Enregisrer
          </Button>
        )}
      </div>
    </Form>
  );
};

export default BonForm;
