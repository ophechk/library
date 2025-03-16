const assert = require('assert');
const {Book} = require('./models');

console.log('Test du modèle Book avec assertions:');

try {
  // Test 1: Vérifier le nom de la table
  assert.strictEqual(Book.tableName, 'books', 'Le nom de la table devrait être "books"');
  
  // Test 2: Vérifier l'existence des champs principaux
  assert(Book.rawAttributes.title, 'Le champ "title" est manquant');
  assert(Book.rawAttributes.author, 'Le champ "author" est manquant');
  assert(Book.rawAttributes.description, 'Le champ "description" est manquant');
  
  console.log('Tous les tests ont réussi!');
} catch (error) {
  console.log('Test échoué:', error.message);
}