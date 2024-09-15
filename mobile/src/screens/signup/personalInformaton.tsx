import {View} from 'react-native';
import {LayoutWithScroll} from '../../_components/layouts/LayoutWithScroll';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {Formik} from 'formik';
import {CustomTextInput} from '@/_components/FormComponents/CustomInput';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {moderateScale} from 'react-native-size-matters';
import {ListBottomSheet} from '@/_components/FormComponents/ListBottomSheet';
import {useFetchCountries} from '@/services/queries/useFetchCountries';
import {ScreenLoader} from '@/_components/loader_utils/ScreenLoader';
import {AuthNavigationStack, type AuthStackParam} from '@/navigation/AuthStack';
import type {RouteProp} from '@react-navigation/native';
import {BackButton} from '@/_components/Button/BackButton';
import {PhoneNumberInput} from '@/_components/FormComponents/PhoneNumberInput';
import * as yup from 'yup';

interface Props {
  navigation: AuthNavigationStack;
  route: RouteProp<AuthStackParam, 'personal-info'>;
}
const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(3, 'Name cannot be less than 3 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .required('Field is required'),
  lastName: yup
    .string()
    .min(3, 'Name cannot be less than 3 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .required('Field is required'),
  country: yup.string().required('Field is required'),
  phoneNumber: yup.string().required('Field is required'),
});
export default function SignupPersonalInformation({navigation, route}: Props) {
  const countries = useFetchCountries();
  const isLoading = !countries.length;
  return (
    <LayoutWithScroll>
      <View
        style={{
          paddingTop: moderateScale(40, 0.1),
        }}
        className="w-full grow pb-10">
        <BackButton onPress={() => navigation.goBack()} />
        <HeaderText weight={700} size={20} className="text-primary">
          Create your account
        </HeaderText>
        <NormalText size={13} className="text-white/80">
          Please provide the required details to help us know you better.
        </NormalText>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            country: '',
            phoneNumber: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            navigation.navigate('create-password', {
              ...route.params,
              ...values,
            });
          }}>
          {({
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            submitForm,
            touched,
            errors,
            dirty,
            isValid,
          }) => {
            const countryCallingCode = countries.find(
              item => item.value === values.country,
            )?.callingCode;
            const isDisabled = !dirty || !isValid;
            return (
              <View className="w-full mt-10">
                <View className="w-full mb-4">
                  <ListBottomSheet
                    title="Country"
                    required
                    placeholder="Select your country"
                    searchBarPlaceholder="Search for country"
                    fieldValue={values.country}
                    options={countries}
                    selectItem={value => {
                      setFieldValue('country', value.value);
                    }}
                    isIconBase64
                  />
                </View>
                <View className="w-full mb-4">
                  <CustomTextInput
                    title="First Name"
                    placeholder="Enter your name"
                    onChangeText={handleChange('firstName')}
                    defaultValue={values.firstName}
                    onBlur={handleBlur('firstName')}
                    errorMessage={errors.firstName}
                    touched={touched.firstName}
                    maxLength={50}
                  />
                </View>
                <View className="w-full mb-4">
                  <CustomTextInput
                    title="Last Name"
                    placeholder="Enter your name"
                    onChangeText={handleChange('lastName')}
                    defaultValue={values.lastName}
                    onBlur={handleBlur('lastName')}
                    errorMessage={errors.lastName}
                    touched={touched.lastName}
                    maxLength={50}
                  />
                </View>
                <View className="w-full mb-4">
                  {countryCallingCode && (
                    <PhoneNumberInput
                      title="Phone Number"
                      placeholder="Enter your phone number"
                      countryCallingCode={countryCallingCode}
                      onChangeText={handleChange('phoneNumber')}
                      defaultValue={values.phoneNumber}
                      onBlur={handleBlur('phoneNumber')}
                      errorMessage={errors.phoneNumber}
                      touched={touched.phoneNumber}
                    />
                  )}
                </View>
                <View
                  style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
                  className="pt-[64px] mt-auto w-full mx-auto justify-start">
                  <ButtonNormal
                    disabled={isDisabled}
                    onPress={() => submitForm()}
                    className="w-full bg-secondary">
                    <NormalText weight={500} className="text-primary/80">
                      Next
                    </NormalText>
                  </ButtonNormal>
                </View>
              </View>
            );
          }}
        </Formik>
      </View>
      {isLoading && <ScreenLoader opacity={0.6} />}
    </LayoutWithScroll>
  );
}
