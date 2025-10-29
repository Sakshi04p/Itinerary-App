import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/ai_suggestions/ai_suggestionsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const Ai_suggestionsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { ai_suggestions } = useAppSelector((state) => state.ai_suggestions)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View ai_suggestions')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View ai_suggestions')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/ai_suggestions/ai_suggestions-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={ai_suggestions?.suggestion} />
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Trip</p>

                        <p>{ai_suggestions?.trip?.title ?? 'No data'}</p>

                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/ai_suggestions/ai_suggestions-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

Ai_suggestionsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default Ai_suggestionsView;
