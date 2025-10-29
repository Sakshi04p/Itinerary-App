import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/trips/tripsSlice'
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

const TripsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { trips } = useAppSelector((state) => state.trips)

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
              <title>{getPageTitle('View trips')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View trips')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/trips/trips-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Title</p>
                    <p>{trips?.title}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>User</p>

                        <p>{trips?.user?.firstName ?? 'No data'}</p>

                </div>

                <FormField label='StartDate'>
                    {trips.start_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={trips.start_date ?
                        new Date(
                          dayjs(trips.start_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No StartDate</p>}
                </FormField>

                <FormField label='EndDate'>
                    {trips.end_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={trips.end_date ?
                        new Date(
                          dayjs(trips.end_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No EndDate</p>}
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Destination</p>
                    <p>{trips?.destination}</p>
                </div>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={trips?.activities} />
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Ai_suggestions Trip</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Suggestion</th>

                            </tr>
                            </thead>
                            <tbody>
                            {trips.ai_suggestions_trip && Array.isArray(trips.ai_suggestions_trip) &&
                              trips.ai_suggestions_trip.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/ai_suggestions/ai_suggestions-view/?id=${item.id}`)}>

                                    <td data-label="suggestion">
                                        { item.suggestion }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!trips?.ai_suggestions_trip?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/trips/trips-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

TripsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default TripsView;
