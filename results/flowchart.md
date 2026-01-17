graph TD
    A[Início] --> B[Landing Page]
    B --> C{Escolha do Usuário}
    
    C -->|Iniciar Questionário| D[Tela de Consentimento]
    C -->|Ver Ranking Global| R[Dashboard de Rankings]
    
    D --> E[Questionário Iniciado]
    E --> F[Exibir Pergunta N]
    
    F --> G{Usuário Solicita Ajuda?}
    G -->|Sim| H[Chamada Gemini API]
    H --> I[Exibir Explicação Contextual]
    I --> F
    
    G -->|Não| J[Usuário Responde]
    J --> K{Mais Perguntas?}
    
    K -->|Sim| L[Próxima Pergunta]
    L --> F
    
    K -->|Não| M[Todas Perguntas Respondidas]
    M --> N[Preparar JSON com Respostas]
    N --> O[Chamada Gemini API - Análise]
    
    O --> P{Análise Bem-Sucedida?}
    P -->|Não| Q[Cálculo Backup Local]
    P -->|Sim| S[Processar Resultado Gemini]
    
    Q --> T[Gerar Scores]
    S --> T
    
    T --> U[Classificação Política]
    U --> V[Tela de Resultados]
    
    V --> W[Exibir Gráfico Radar]
    V --> X[Exibir Scores Detalhados]
    V --> Y[Exibir Análise Textual]
    V --> Z[Exibir Figuras Similares]
    
    V --> AA{Ação do Usuário}
    AA -->|Salvar no Ranking| AB[Armazenar Dados Anônimos]
    AB --> R
    AA -->|Ver Ranking Global| R
    AA -->|Compartilhar| AC[Gerar Link/Imagem]
    AA -->|Refazer| E
    AA -->|Análise Completa| AD[Exibir Detalhes Expandidos]
    
    R --> AE[Exibir Distribuição Geral]
    R --> AF[Exibir Scores Médios]
    R --> AG[Comparar com Usuário]
    
    R --> AH{Nova Ação}
    AH -->|Fazer Questionário| D
    AH -->|Voltar Início| B
    
    style A fill:#48bb78
    style V fill:#ecc94b
    style H fill:#4299e1
    style O fill:#4299e1
    style R fill:#9f7aea