export function validateFields(data, fields) {

      for (const field of fields) {

            if (!data[field]) {
                  return false;
            }

      }

      return true;

}


export function validateData(condition, res, error) {

      if (condition) {

            res.status(404).send({
                  status: 'error',
                  message: error
            });

            throw new Error(error);

      };

}

export function validateDataDB(condition, message) {

      if (condition) {
            console.log(message)
      };

}

export function handleTryErrorDB(error) {

      console.log(error);

}

export function handleTryError(res, error) {

      res.status(500).send({
            status: 'error',
            message: 'Error en el servidor'
      });

      console.log(error);

};