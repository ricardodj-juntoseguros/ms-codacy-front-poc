import { AxiosHttpClient } from './AxiosHttpClient';
import IHttpClientRequestParameters from '../types/IHttpClientRequestParameters';

interface UserResponseModel {
  age: number;
  name: string;
}
interface LoginResponseModel {
  user?: UserResponseModel;
  token: string;
}
interface TaskCreateResponseModel {
  success: boolean;
  data: {
    _id: string;
    description: string;
  };
}

// upgrade defautl timeout
jest.setTimeout(10000);

describe('Axios HTTP client', () => {
  let token: string;
  let instance: AxiosHttpClient;

  beforeEach(async () => {
    if (!instance)
      instance = new AxiosHttpClient(
        'https://api-nodejs-todolist.herokuapp.com',
        10000,
      );

    if (!token) await authenticate();
  });

  it('should execute GET method without error', async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const getParameters: IHttpClientRequestParameters = {
      url: '/user/me',
      headers,
    };

    const response = await instance.get<UserResponseModel>(getParameters);
    expect(response.age).toEqual(55);
    expect(response.name).toEqual('Platform Web Test');
  });

  it('should execute POST method without error', async () => {
    const taskDescription = 'create task';
    const response = await createTask('create task');
    expect(response.data.description).toEqual(taskDescription);
  });

  it('should execute PUT method without error', async () => {
    const id = await (await createTask('create task')).data._id;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      completed: true,
    };

    const getParameters: IHttpClientRequestParameters = {
      url: `/task/${id}`,
      headers,
      payload,
    };

    const response = await instance.put<TaskCreateResponseModel>(getParameters);
    expect(response.success).toEqual(true);
  });

  it('should execute DELETE method without error', async () => {
    const id = await (await createTask('create task')).data._id;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      completed: true,
    };

    const getParameters: IHttpClientRequestParameters = {
      url: `/task/${id}`,
      headers,
      payload,
    };

    const response = await instance.delete<TaskCreateResponseModel>(
      getParameters,
    );
    expect(response.success).toEqual(true);
  });

  async function createTask(description: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      description,
    };

    const getParameters: IHttpClientRequestParameters = {
      url: '/task',
      headers,
      payload,
    };

    return await instance.post<TaskCreateResponseModel>(getParameters);
  }

  async function authenticate() {
    const data = {
      email: 'jpwtest@email.com',
      password: '12345678',
    };

    const getParameters: IHttpClientRequestParameters = {
      url: '/user/login',
      payload: data,
    };

    const response = await instance.post<LoginResponseModel>(getParameters);
    token = response.token;
  }
});
