export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeather {
  name: string
  dt: number
  weather: WeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  wind: {
    speed: number
    deg: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
    timezone: number
  }
  clouds: {
    all: number
  }
  visibility: number
  coord: {
    lat: number
    lon: number
  }
}

export interface ForecastData {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: WeatherCondition[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  pop: number
  dt_txt: string
}

export interface AirQuality {
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}