import { createModel } from './models/costCalculation.1.mjs'
import createStartMessage from './controllers/StartMessage.2.mjs'

const { Application, Controller} = Stimulus

const application = Application.start()
application.register("startMessage", createStartMessage(Controller))

const { settings, calculateRounded } = createModel(luxon, math)

function showResult (e) {
  e.preventDefault()
  try {
  const distance = parseInt(document.getElementById('distance').value)
  const duration = parseInt(document.getElementById('duration').value)
  const kWhPerKm = parseInt(document.getElementById('kWhPer100Km').value)/100
  const startTimeMinutes = parseInt(document.getElementById('startTimeMinutes').value)
  const startTimeHours = parseInt(document.getElementById('startTimeHours').value)
  const startTime = luxon.DateTime.local().setLocale('Europe/Brussels')
    .set({ hours: startTimeHours, minutes: startTimeMinutes })
  showResultBox(distance, duration, kWhPerKm, startTime)
  } catch (e) {
    console.error(e)
  }
  // showFixedDistanceGraph(distance, kWhPerKm, startTime)
  // showFixedTimeGraph(distance, duration, kWhPerKm, startTime)
  return false
}

document.getElementById('resultSubmit').addEventListener('click', showResult)

function showResultBox (distance, duration, kWhPerKm, startTime) {
  const lines = []
  // TODO: push up cookie logic
  document.cookie=`distance=${distance}`
  document.cookie=`duration=${duration}`
  document.cookie=`kWhPer100Km=${kWhPerKm *  100}`
  for (name in settings) {
    lines.push(`<strong>${ name }:</strong>&nbsp;${calculateRounded({ name, distance, duration, kWhPerKm, startTime })}&euro;`)
  }
  document.getElementById('result').innerHTML = lines.join('<br>')
}

function showGraph (series, id, titleText) {
  Highcharts.chart(id, {
    title: { text: titleText, useHTML: true },
    yAxis: { title: { text: 'Kost' } },
    legend: { useHTML: true, layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 0 } },
    series,
    responsive: {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom'}
        }
      }]
    }
  });
}

function showFixedDistanceGraph (distance, kWhPerKm, startTIme) {
  const series = []
  const now = new Date()
  now.setHours(7)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  Object.entries(settings).forEach(([name, { getKeyValues, variables }], i, array) => {
    const data = []
    const color = d3.interpolateRainbow(i/array.length) 
    if (getKeyValues) {
      const extendedSeries = getKeyValues({ 
        startTime: DateTime.local().setLocale('Europe/Brussels'),
        timeRangeMs: [0, 24 * 60 * 60 * 1000 ],
        distanceRange: distance,
        variables: { ...variables, kWhPerKm }
      })
      data.push(...extendedSeries.map(([time, _, cost]) => ([time, cost])))
    } else {
      for (let duration = 0; duration < 24 * 60 ; duration += 5) data.push([now.valueOf() + duration * 60 * 1000, calculateRounded({ name, distance, duration, startTime })])
    }
    series.push({ name, data, color })
  })
  Highcharts.chart('fixedDistanceGraph', {
    title: { text: `Kost per tijd voor ${distance}&thinsp;km`, useHTML: true },
    yAxis: { title: { text: 'Kost' } },
    xAxis: { type: 'datetime' }, 
    legend: { useHTML: true, layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: {
      series: { label: { connectorAllowed: false }, pointStart: 0 }
    },
    series,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  })
}

function showFixedTimeGraph (distance, duration, kWhPerKm, startTime) {
  const series = []
  const maxKm = duration / 60 * 120 // maximum 120 distance/h
  Object.entries(settings).forEach(([name], i, array) => {
    const data = []
    const color = d3.interpolateRainbow(i/array.length) 
    for (let distance = 0; distance <= maxKm; distance++) data.push(calculateRounded({ name, distance, duration, kWhPerKm, startTime }))
    series.push({ name, data, color })
  })
  showGraph(series, 'fixedTimeGraph', `Kost per afstand voor ${duration}&thinsp;min`)
}

window.onload = () => {
  const distance = (document.cookie.match(/distance=(\d*)/) || [])[1]
  const duration = (document.cookie.match(/duration=(\d*)/) || [])[1]
  const kWhPer100Km = (document.cookie.match(/kWhPer100Km=(\d*)/) || [])[1] 
  const startOffset = luxon.Duration.fromObject({ hours: 6, minutes: 0 }) 
  if (distance) document.getElementById('distance').value = distance
  if (duration) document.getElementById('duration').value = duration
  if (kWhPer100Km) document.getElementById('kWhPer100Km').value = kWhPer100Km
  document.getElementById('startTimeMinutes').value = startOffset.minutes
  document.getElementById('startTimeHours').value = startOffset.hours
}