import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Shoulg get a statement", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 90,
      description: "deposit test",
      type: OperationType.DEPOSIT,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string,
    });

    expect(statement).toEqual(deposit);
  });

  it("Shoulg throw an error if not find statement", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "statement not exists",
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("Shoulg throw an error if not find user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user_not_exists",
        statement_id: "statement not exists",
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });
});
