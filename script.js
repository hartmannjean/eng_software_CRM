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

function searchByBirthDate() {
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
}

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
        return response; // Converte a resposta para JSON
      })
      .then((data) => {
        fetchData(); // Atualiza a tabela após adicionar
        alert("Cliente cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao adicionar pessoa:", error);
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
        return response; // Converte a resposta para JSON
      })
      .then((data) => {
        fetchData(); // Atualiza a tabela após atualizar
        alert("Cliente atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar pessoa:", error);
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
        console.log(response);
        if (!response.ok) {
          throw new Error("Erro ao excluir pessoa");
        }
        fetchData(); // Atualiza a tabela após excluir
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
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });

    document.getElementById("addLogradouro").value = response.logradouro;
    document.getElementById("addBairro").value = response.bairro;
    document.getElementById("addCidade").value = response.localidade;
  }
};

function populateTable(data) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";

  data.forEach((person) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="clickable">${person.NomeCompleto}</td>
            <td>${person.Email}</td>
            <td>${person.DataNascimento}</td>
            <td>${person.Logradouro}, ${person.Numero} - ${person.Cidade}</td>
        `;

    // Criar botão "Enviar E-mail" e adicioná-lo à célula correspondente (última célula)
    const emailButton = document.createElement("button");
    emailButton.textContent = "Enviar E-mail";
    emailButton.addEventListener("click", () =>
      enviarEmailStatusProducao(person.NomeCompleto, person.Email)
    );
    const emailCell = document.createElement("td");
    emailCell.appendChild(emailButton);
    row.appendChild(emailCell);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deletePerson(person.id));
    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", () => {
      id = person.id;
      defineOperation("update");
    });
    const updateCell = document.createElement("td");
    updateCell.appendChild(updateButton);
    row.appendChild(updateCell);

    tableBody.appendChild(row);
  });
}

function fillForm(person) {
  document.getElementById("updateId").value = person.id;
  document.getElementById("updateName").value = person.NomeCompleto;
  document.getElementById("updateEmail").value = person.Email;
  document.getElementById("updateBirthDate").value = person.DataNascimento;
  document.getElementById("updateLogradouro").value = person.Logradouro;
  document.getElementById("updateNumero").value = person.Numero;
  document.getElementById("updateComplemento").value = person.Complemento;
  document.getElementById("updateBairro").value = person.Bairro;
  document.getElementById("updateCidade").value = person.Cidade;
  document.getElementById("updateCEP").value = person.CEP;

  // Remove qualquer botão de "Enviar E-mail" anteriormente adicionado
  const emailButtonCell = document.getElementById("emailButtonCell");
  if (emailButtonCell) {
    emailButtonCell.innerHTML = "";
  }

  // Cria e adiciona o botão "Enviar E-mail" na célula correspondente
  const emailButton = document.createElement("button");
  emailButton.textContent = "Enviar E-mail";
  emailButton.addEventListener("click", () => enviarEmail(person.Email));

  // Encontra a célula onde o botão deve ser adicionado
  const tableRows = document.querySelectorAll("#dataTable tbody tr");
  for (let i = 0; i < tableRows.length; i++) {
    const cells = tableRows[i].querySelectorAll("td");
    const emailCell = cells[1]; // Considerando que o e-mail está na segunda coluna da tabela
    if (emailCell.textContent === person.Email) {
      emailButtonCell = cells[8]; // Ajuste conforme a posição correta da célula de e-mail na tabela
      emailButtonCell.appendChild(emailButton);
      break;
    }
  }
}

function enviarEmailStatusProducao(nomeCliente, email) {
  console.log(nomeCliente);
  fetch(
    `https://yawodnvmejpiormfvflv.supabase.co/rest/v1/Producao?NomeCliente=eq.${nomeCliente}&select=*`,
    {
      method: "GET",
      headers: AUTH_HEADER,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        const producao = data[0];

        const quantidadeRestante =
          producao.QuantidadeTotal - producao.QuantidadeProduzida;
        const templateParams = {
          NomeCliente: producao.NomeCliente,
          DataHoraEtapaAtual: formatarDataHora(
            new Date(producao.DataHoraEtapaAtual)
          ), // Adicionando a data e hora atuais
          ProdutoProduzido: producao.ProdutoProduzido,
          EtapaAtualProducao: producao.EtapaAtualProducao,
          QuantidadeProduzida: producao.QuantidadeProduzida,
          QuantidadeRestante: quantidadeRestante,
          EtapaSeguinteProducao: producao.EtapaSeguinteProducao,
          destinatario_email: email,
        };

        // Chamar a função para enviar o e-mail
        enviarEmail(templateParams);
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
}

function enviarEmail(templateParams) {
  emailjs
    .send(
      "service_hied2cd",
      "template_1c6zv8n",
      templateParams,
      "GS6zzkCsEYgGrpkAI"
    )
    .then(
      function (response) {
        console.log("E-mail enviado com sucesso!", response);
        // Lógica adicional após o envio
      },
      function (error) {
        console.error("Erro ao enviar e-mail:", error);
      }
    );
}

function formatarDataHora(date) {
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");
  const segundos = String(date.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

changeScreen("home");
fetchData(); // Carrega os dados iniciais ao abrir a página
