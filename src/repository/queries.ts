import { IUser } from "../config/interfaces";
import { DBclient } from "../util/sequelize";

class QueriesRepository {
  public async runQuery(query: string, values?: any[]) {
    const executeQuery = await DBclient.query(query, values);

    return executeQuery;
  }
}

export default new QueriesRepository();
