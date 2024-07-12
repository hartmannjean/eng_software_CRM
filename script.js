const API_URL = "https://yawodnvmejpiormfvflv.supabase.co/rest/v1/Pessoa";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd29kbnZtZWpwaW9ybWZ2Zmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzOTY1MjcsImV4cCI6MjAzNTk3MjUyN30.ziko4SreKN4SaJV4FPDPSNljyYIYzk4fhMMKj8dheGE";
const AUTH_HEADER = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
};

let operation = "";
let id;

const cleanFields = () => {
  document.getElementById("addName").value = "";
  document.getElementById("addEmail").value = "";
  document.getElementById("addBirthDate").value = "";
  document.getElementById("addCEP").value = "";
  document.getElementById("addLogradouro").value = "";
  document.getElementById("addNumero").value = "";
  document.getElementById("addComplemento").value = "";
  document.getElementById("addBairro").value = "";
  document.getElementById("addCidade").value = "";
};

const getPersonById = async (id) => {
  const data = await fetch(`${API_URL}?id=eq.${id}&select=*`, {
    method: "GET",
    headers: AUTH_HEADER,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
    });

  document.getElementById("addName").value = data[0].NomeCompleto;
  document.getElementById("addEmail").value = data[0].Email;
  document.getElementById("addBirthDate").value = data[0].DataNascimento;
  document.getElementById("addCEP").value = data[0].CEP;
  document.getElementById("addLogradouro").value = data[0].Logradouro;
  document.getElementById("addNumero").value = data[0].Numero;
  document.getElementById("addComplemento").value = data[0].Complemento;
  document.getElementById("addBairro").value = data[0].Bairro;
  document.getElementById("addCidade").value = data[0].Cidade;
};

const changeScreen = (tela) => {
  cleanFields();
  const home = document.getElementById("home");
  const operations = document.getElementById("operation");
  home.style.display = "none";
  operations.style.display = "none";

  switch (tela) {
    case "home":
      home.style.display = "flex";
      break;
    case "operation":
      operations.style.display = "flex";
      if (operation === "update") {
        getPersonById(id);
      }
      break;
  }
};

const defineOperation = (op) => {
  operation = op;
  changeScreen("operation");
};

document
  .getElementById("btnNewClient")
  .addEventListener("click", defineOperation("create"));

const fetchData = async () => {
  await fetch(`${API_URL}?select=*`, {
    method: "GET",
    headers: AUTH_HEADER,
  })
    .then((response) => response.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
    });
};

const searchByBirthDate = () => {
  const birthDate = document.getElementById("birthDate").value;
  fetch(`${API_URL}?DataNascimento=eq.${birthDate}&select=*`, {
    method: "GET",
    headers: AUTH_HEADER,
  })
    .then((response) => response.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
    });
};

const addPerson = async () => {
  const person = {
    NomeCompleto: document.getElementById("addName").value,
    Email: document.getElementById("addEmail").value,
    DataNascimento: document.getElementById("addBirthDate").value,
    CEP: document.getElementById("addCEP").value,
    Logradouro: document.getElementById("addLogradouro").value,
    Numero: document.getElementById("addNumero").value,
    Complemento: document.getElementById("addComplemento").value,
    Bairro: document.getElementById("addBairro").value,
    Cidade: document.getElementById("addCidade").value,
  };
  if (operation === "create") {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        ...AUTH_HEADER,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(person),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar pessoa");
        }
        return response;
      })
      .then((data) => {
        fetchData();
        alert("Cliente cadastrado com sucesso!");
      })
      .catch((error) => {
        alert("Ocorreu um erro ao cadastrar o cliente.");
      });
  } else {
    await fetch(`${API_URL}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        ...AUTH_HEADER,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(person),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar pessoa");
        }
        return response;
      })
      .then((data) => {
        fetchData();
        alert("Cliente atualizado com sucesso!");
      })
      .catch((error) => {
        alert("Ocorreu um erro ao atualizar o cliente.");
      });
  }
  changeScreen("home");
};

const deletePerson = async (personId) => {
  if (confirm("Deseja deletar este usuário?")) {
    await fetch(`${API_URL}?id=eq.${personId}`, {
      method: "DELETE",
      headers: AUTH_HEADER,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir pessoa");
        }
        fetchData();
      })
      .catch((error) => {
        console.error("Erro ao excluir pessoa:", error);
      });
  }
};

const fetchAddress = async () => {
  const cep = document.getElementById("addCEP").value;
  if (cep.length === 8) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch(function (error) {
        alert("CPF não encontrado!");
      });

    if (!response.erro) {
      document.getElementById("addLogradouro").value = response.logradouro;
      document.getElementById("addBairro").value = response.bairro;
      document.getElementById("addCidade").value = response.localidade;
      document.getElementById("addUF").value = response.uf;
    }
  }
};

const populateTable = (data) => {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  data.forEach((person) => {
    const row = document.createElement("div");
    row.innerHTML = `
            <h3 class="clickable">${person.NomeCompleto}</h3>
            <h3>${person.Email}</h3>
            <h3>${person.DataNascimento}</h3>
            <h3>${person.Logradouro}, ${person.Numero} - ${person.Cidade}</h3>
        `;

    const emailButton = document.createElement("button");
    emailButton.textContent = "Enviar E-mail";
    emailButton.addEventListener("click", () =>
      sendEmailProductionStatus(person.NomeCompleto, person.Email)
    );
    const emailCell = document.createElement("div");
    emailCell.appendChild(emailButton);

    const deleteButton = document.createElement("a");
    deleteButton.innerHTML =
      "<img src='https://static-00.iconduck.com/assets.00/x-circle-close-delete-icon-256x256-l64id5on.png' alt=''>";
    deleteButton.addEventListener("click", () => deletePerson(person.id));

    const updateButton = document.createElement("a");
    updateButton.innerHTML =
      "<img src='https://cdn.iconscout.com/icon/free/png-256/free-edit-3352303-2791239.png' alt=''>";
    updateButton.addEventListener("click", () => {
      id = person.id;
      defineOperation("update");
    });

    emailCell.appendChild(updateButton);
    emailCell.appendChild(deleteButton);
    row.appendChild(emailCell);
    tableBody.appendChild(row);
  });
};

const sendEmailProductionStatus = (nomeCliente, email) => {
  fetch(
    `https://yawodnvmejpiormfvflv.supabase.co/rest/v1/Producao?NomeCliente=eq.${nomeCliente}&select=*`,
    {
      method: "GET",
      headers: AUTH_HEADER,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const producao = data[0];

        const quantidadeRestante =
          producao.QuantidadeTotal - producao.QuantidadeProduzida;
        const templateParams = {
          NomeCliente: producao.NomeCliente,
          DataHoraEtapaAtual: formateDate(
            new Date(producao.DataHoraEtapaAtual)
          ),
          ProdutoProduzido: producao.ProdutoProduzido,
          EtapaAtualProducao: producao.EtapaAtualProducao,
          QuantidadeProduzida: producao.QuantidadeProduzida,
          QuantidadeRestante: quantidadeRestante,
          EtapaSeguinteProducao: producao.EtapaSeguinteProducao,
          destinatario_email: email,
        };

        sendEmail(templateParams);
      } else {
        console.error(
          "Nenhuma produção encontrada para o cliente:",
          nomeCliente
        );
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de produção:", error);
    });
};

const sendEmail = (templateParams) => {
  emailjs
    .send(
      "service_hied2cd",
      "template_1c6zv8n",
      templateParams,
      "GS6zzkCsEYgGrpkAI"
    )
    .then(
      function (response) {
        alert("Email enviado com sucesso!");
      },
      function (error) {
        alert("Ocorreu um erro ao enviar o email, tente novamente mais tarde.");
      }
    );
};

const formateDate = (date) => {
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");
  const segundos = String(date.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
};

changeScreen("home");
fetchData();
