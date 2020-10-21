import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles, Button, Box, Typography } from '@material-ui/core'
import InputField from '../Utils/InputField'
import SectionCard from '../Utils/SectionCard'
import BracketFormatRadioGroup from './BracketFormat/'
import useFormValidation from './Utils/useFormValidation'
import {
  createFormElementsArray,
  getInputFieldsData,
  getUpdatedInputValue,
  getUpdatedTouched,
  getUpdatedCustomUrl,
  getUpdatedUrlAvailabilityFlag
} from './Utils/form'
import useFormFieldControls from './useFormFieldControls'
import {
  newTournamentSubmit,
  newTournamentUrlChange
} from '../../data/actions/tournament/tournamentActions'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'left',
    margin: 'auto',
    marginTop: '2rem',
    width: '90%'
  },
  formControl: {
    margin: '1rem 0'
  }
}))

export default function NewTournamentForm () {
  const { t } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch()

  const { getFormFieldControls } = useFormFieldControls()
  const {
    isFormTouched,
    isFormValid
  } = useFormValidation()

  const [bracketFormat, setBracketFormat] = useState('singleElimination')
  const [fieldControls, setFieldControls] = useState(getFormFieldControls())
  const [displayDataIncorrectLabel, setDisplayDataIncorrectLabel] = useState(true)

  const formArray = createFormElementsArray(fieldControls)

  const isUrlAvailable = useSelector(state => state.tournament.isUrlAvailable)
  const isUrlCheckInProgress = useSelector(state => state.tournament.isUrlCheckInProgress)

  useEffect(() => {
    onUrlAvailabilityChange()
  }, [isUrlAvailable, isUrlCheckInProgress])

  const debouncedUrlCheck = React.useCallback(_.debounce((value) => {
    dispatch(newTournamentUrlChange(value))
  }, 500), [])

  i18n.on('languageChanged', () => {
    const newFieldControls = getFormFieldControls()

    for (const key in newFieldControls) {
      newFieldControls[key].value = fieldControls[key].value
      newFieldControls[key].touched = fieldControls[key].touched
      newFieldControls[key].valid = fieldControls[key].valid
    }

    if (!isFormValid(fieldControls)) {
      updateErrorMessages()
    }

    setFieldControls(newFieldControls)
  })

  function onInputValueChange (value, fieldName) {
    value = value.trim()

    const updatedFieldControls = getUpdatedInputValue(value, fieldName, fieldControls)
    setFieldControls(updatedFieldControls)
    console.log(isFormValid(bracketFormat, fieldControls), isFormTouched(fieldControls))
    setDisplayDataIncorrectLabel(!isFormValid(bracketFormat, updatedFieldControls))
  }

  function onUrlAvailabilityChange () {
    const updatedFieldControls = getUpdatedUrlAvailabilityFlag(fieldControls, isUrlAvailable)
    setFieldControls(updatedFieldControls)
    setDisplayDataIncorrectLabel(!isFormValid(bracketFormat, updatedFieldControls))
  }

  function onCustomUrlValueChange (value, fieldName) {
    value = value.replace(/\s+$/, '')
    debouncedUrlCheck(value)

    const updatedFieldControls = getUpdatedCustomUrl(value, fieldName, fieldControls)
    setFieldControls(updatedFieldControls)
  }

  function setTouched (fieldName) {
    const updatedFieldControls = getUpdatedTouched(fieldName, fieldControls)
    setFieldControls(updatedFieldControls)
  }

  function updateErrorMessages () {
    for (const key in fieldControls) {
      if (!fieldControls[key].valid) {
        return setTouched(key)
      }
    }
  }

  function handleFormSubmit () {
    if (isFormValid(bracketFormat, fieldControls) && !isUrlCheckInProgress) {
      const tournamentData = getInputFieldsData(bracketFormat, fieldControls)
      dispatch(newTournamentSubmit(tournamentData))
    } else {
      updateErrorMessages()
    }
  }

  function mapField (field) {
    return (
      <div
        key={field.id}
        className={classes.formControl}
      >
        <InputField
          value={field.config.value}
          type={field.config.inputType}
          elementConfig={field.config.elementConfig}
          id={field.id}
          autoFocus={field.config.autoFocus}
          validation={field.config.validation}
          changed={(e) => {
            field.id === 'customUrl'
              ? onCustomUrlValueChange(e.target.value, field.id)
              : onInputValueChange(e.target.value, field.id)
          }}
          touched={() => { setTouched(field.id) }}
          error={!field.config.valid && field.config.touched}
        />
      </div>
    )
  }

  let incorrectDataLabel = null

  if (displayDataIncorrectLabel) {
    incorrectDataLabel = (
      <Typography
        color='error'
        component='h6'
      >
        {t('form:incorrect-data')}
      </Typography>
    )
  }

  return (
    <div className={classes.root}>
      <SectionCard
        title={t('form:bracket-format')}
      >
        <BracketFormatRadioGroup
          value={bracketFormat}
          changed={setBracketFormat}
        />
      </SectionCard>
      <SectionCard
        title={t('form:form-title')}
      >
        {formArray.map(field => (
          mapField(field)
        ))}
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
          <Button
            onClick={handleFormSubmit}
            className={classes.formControl}
            size='large'
            color='primary'
            variant='contained'
            disabled={displayDataIncorrectLabel}
          >
            {t('submit')}
          </Button>
          {incorrectDataLabel}
        </Box>
      </SectionCard>
    </div>
  )
}
