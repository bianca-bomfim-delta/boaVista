import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../styles/resultCpf.css";

const ResultCpf = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const resultado = location.state?.resultado;

  if (!resultado) {
    return (
      <div className="cpf-result-container">
        <h2>Nenhum resultado encontrado.</h2>
        <button
          className="button-cpf-score"
          onClick={() => navigate("/scoreCpf")}
        >
          Nova Consulta
        </button>
      </div>
    );
  }

  const scoreValue = Number(resultado.scoreAprovacaoPositivo?.score || 0);

  const getColorByScore = (score) => {
    if (score < 200) return "#FF4444";
    if (score < 400) return "#FF8042";
    if (score < 700) return "#FFBB28";
    return "#00C49F";
  };

  return (
    <div className="cpf-result-container">

      <h1>Resultado da Consulta</h1>

      <div className="cpf-card">

        {/* VELOCÍMETRO DO SCORE */}

        <h2>Score de Aprovação Positivo</h2>

        <div className="gauge-container">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              {/* Fundo cinza */}
              <Pie
                data={[{ value: 1000 }]}
                startAngle={180}
                endAngle={0}
                cx="50%"
                cy="100%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                fill="#E0E0E0"
                stroke="none"
              />

              {/* Score renderizado */}
              <Pie
                data={[{ value: scoreValue }]}
                cx="50%"
                cy="100%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={180 - (scoreValue / 1000) * 180}
                stroke="none"
              >
                <Cell fill={getColorByScore(scoreValue)} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Agulha */}
          {(() => {
            const angle = -90 + (scoreValue / 1000) * 180;

            return (
              <>
                <div
                  className="gauge-needle"
                  style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                />
                <div className="gauge-center" />
              </>
            );
          })()}

          <div className="gauge-score">{scoreValue}</div>
        </div>

        {/* Texto Explicativo */}
        <p className="score-explanation">
          {resultado.scoreAprovacaoPositivo?.texto || "—"}
        </p>

        {/* IDENTIFICAÇÃO */}
   
        <h2 className="section-title">Identificação</h2>
        <div className="score-info">
          <p><strong>Nome:</strong> {resultado.identificacao?.nome || "—"}</p>
          <p><strong>CPF:</strong> {resultado.identificacao?.cpf || "—"}</p>
          <p><strong>Data de Nascimento:</strong> {resultado.identificacao?.dataNascimento || "—"}</p>
          <p><strong>Nome da Mãe:</strong> {resultado.identificacao?.nomeMae || "—"}</p>
          <p><strong>Sexo:</strong> {resultado.identificacao?.sexo || "—"}</p>
          <p><strong>Estado Civil:</strong> {resultado.identificacao?.estadoCivil || "—"}</p>
        </div>

        {/* ENDEREÇO */}

        <h2 className="section-title">Endereço</h2>
        <div className="score-info">
          <p><strong>Logradouro:</strong> {resultado.endereco?.logradouro || "—"}</p>
          <p><strong>Número:</strong> {resultado.endereco?.numero || "—"}</p>
          <p><strong>Bairro:</strong> {resultado.endereco?.bairro || "—"}</p>
          <p><strong>Cidade:</strong> {resultado.endereco?.cidade || "—"}</p>
          <p><strong>UF:</strong> {resultado.endereco?.uf || "—"}</p>
          <p><strong>CEP:</strong> {resultado.endereco?.cep || "—"}</p>
        </div>

        {/* INDICADORES POSITIVOS */}

        <h2 className="section-title">Indicadores Positivos</h2>
        <div className="score-info">
          <p><strong>Contratos Recentes:</strong> {resultado.indicadoresPositivos?.contratosRecentes || "—"}</p>
          <p><strong>Faturas em Atraso:</strong> {resultado.indicadoresPositivos?.faturaEmAtraso || "—"}</p>
        </div>

        {/* REGISTROS NEGATIVOS */}

        <h2 className="section-title">Registros Negativos</h2>
        <div className="score-info">
          {Object.entries(resultado.registrosNegativos || {}).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value === "N" ? "Nada Consta" : value}
            </p>
          ))}
        </div>

        {/* CONSULTAS RECENTES */}

        <h2 className="section-title">Consultas Recentes</h2>
        <div className="score-info">
          {resultado.consultasAnteriores?.length > 0 ? (
            resultado.consultasAnteriores.map((c, i) => (
              <p key={i}>
                <strong>{c.data}</strong> — {c.informante} ({c.tipoOcorrencia})
              </p>
            ))
          ) : (
            <p>Nenhuma consulta registrada.</p>
          )}
        </div>

        {/* CONSULTAS 90 DIAS */}

        <h2 className="section-title">Resumo de Consultas (90 dias)</h2>
        <div className="score-info">
          {resultado.resumoConsultas90Dias?.periodo?.map((p, i) => (
            <p key={i}>
              <strong>{p.mes}/{p.ano}</strong> — {p.total}
            </p>
          ))}
        </div>

        {/* PARTICIPAÇÕES EM EMPRESAS */}

        <h2 className="section-title">Participações em Empresas</h2>
        <div className="score-info">
          {resultado.participacoesEmpresas?.length > 0 ? (
            resultado.participacoesEmpresas.map((empresa, index) => (
              <p key={index}>
                <strong>{empresa.razaoSocial}</strong> — {empresa.funcao} ({empresa.percentual}%)
              </p>
            ))
          ) : (
            <p>Nenhuma participação encontrada.</p>
          )}
        </div>

        {/* BOTÃO NOVA CONSULTA */}

        <button
          className="button-cpf-score"
          style={{ marginTop: "25px" }}
          onClick={() => navigate("/scoreCpf")}
        >
          Nova Consulta
        </button>

      </div>
    </div>
  );
};

export default ResultCpf;
