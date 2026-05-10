// Random interlocutor name generator. Used to give each simulation session
// a believable named character (e.g. "María Sánchez — Manager de IT") instead
// of a generic role label.

const FEMALE_FIRST = ['María', 'Lucía', 'Camila', 'Sofía', 'Valentina', 'Florencia', 'Carla', 'Paula', 'Julieta', 'Agustina', 'Daniela', 'Romina', 'Mariana', 'Elena', 'Silvia']
const MALE_FIRST   = ['Roberto', 'Martín', 'Diego', 'Federico', 'Alejandro', 'Mariano', 'Juan', 'Lucas', 'Pablo', 'Gabriel', 'Andrés', 'Tomás', 'Sebastián', 'Hernán', 'Ricardo']
const NEUTRAL_FIRST = ['Alex', 'Cris', 'Sam', 'Dani', 'René', 'Jules']

const LAST_NAMES = ['Sánchez', 'García', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Pérez', 'Gómez', 'Romero', 'Suárez', 'Álvarez', 'Torres', 'Ruiz', 'Castro', 'Vargas']

const ENGLISH_FEMALE = ['Sarah', 'Emily', 'Jessica', 'Megan', 'Anna', 'Rachel', 'Lauren']
const ENGLISH_MALE   = ['Michael', 'David', 'Robert', 'James', 'Thomas', 'Daniel', 'Brian']
const ENGLISH_LAST   = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateInterlocutorName(gender, language = 'Spanish') {
  if (language === 'English') {
    const first = gender === 'male' ? pick(ENGLISH_MALE) : gender === 'female' ? pick(ENGLISH_FEMALE) : pick([...ENGLISH_FEMALE, ...ENGLISH_MALE])
    return `${first} ${pick(ENGLISH_LAST)}`
  }
  const first = gender === 'male' ? pick(MALE_FIRST) : gender === 'female' ? pick(FEMALE_FIRST) : pick(NEUTRAL_FIRST)
  return `${first} ${pick(LAST_NAMES)}`
}
