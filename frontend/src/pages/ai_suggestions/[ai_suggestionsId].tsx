import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/ai_suggestions/ai_suggestionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditAi_suggestions = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    suggestion: '',

    trip: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { ai_suggestions } = useAppSelector((state) => state.ai_suggestions)

  const { ai_suggestionsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: ai_suggestionsId }))
  }, [ai_suggestionsId])

  useEffect(() => {
    if (typeof ai_suggestions === 'object') {
      setInitialValues(ai_suggestions)
    }
  }, [ai_suggestions])

  useEffect(() => {
      if (typeof ai_suggestions === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (ai_suggestions)[el])

          setInitialValues(newInitialVal);
      }
  }, [ai_suggestions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: ai_suggestionsId, data }))
    await router.push('/ai_suggestions/ai_suggestions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit ai_suggestions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit ai_suggestions'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label="Suggestion" hasTextareaHeight>
        <Field name="suggestion" as="textarea" placeholder="Suggestion" />
    </FormField>

    <FormField label='Trip' labelFor='trip'>
        <Field
            name='trip'
            id='trip'
            component={SelectField}
            options={initialValues.trip}
            itemRef={'trips'}

            showField={'title'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/ai_suggestions/ai_suggestions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditAi_suggestions.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditAi_suggestions
