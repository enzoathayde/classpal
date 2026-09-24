package com.classpal.usuarios.cadastrarUsuario;

final class CadastrarUsuarioHelpers {

	private CadastrarUsuarioHelpers() {
	}

	static String nomeGenerico(String email) {
		String local = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
		String limpo = local.replaceAll("[^a-zA-Z0-9]", " ").trim();
		if (limpo.isBlank()) {
			return "Professor";
		}
		String[] parts = limpo.split("\\s+");
		StringBuilder sb = new StringBuilder("Professor ");
		for (String part : parts) {
			if (part.isBlank()) {
				continue;
			}
			sb.append(Character.toUpperCase(part.charAt(0)));
			if (part.length() > 1) {
				sb.append(part.substring(1).toLowerCase());
			}
			sb.append(' ');
		}
		return sb.toString().trim();
	}
}
