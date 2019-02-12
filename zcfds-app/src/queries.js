import gql from "graphql-tag";

const UserFragment = gql`
	fragment UserFragment on User {
		id
		email
		firstname
		lastname
		phoneNumber
		plateNumber,
		address,
		isActive,
		profilePicture {
			id,
			url
		},
		restaurant {
			id,
			name, description, telephoneNumber, dayOfWeeks, startTime, endTime
		},
		assignRestaurants {
			id,
			restaurant {
				id,
				name
			}
		}
	}`;

const MenuItemFragment = gql`
	fragment MenuItemFragment on MenuItem {
		id
		name
		description
		hasSpecialInstruction
		price
		available,
		thumbnail {
			id,
			url
		},
		categories {
			id,
			name
		}
	}`;

const CartFragment = gql`
	fragment CartFragment on Cart {
		id,
		restaurant {
			id,
			profilePicture {
				id,
				url
			},
			details: restaurant {
				id,
				name,
			}
		},
		cartItems {
			id,
			quantity,
			specialInstruction,
			menuItem {
				id,
				name,
				price,
				thumbnail {
					id, url
				}
			}
		}
	}
`;

export const ME = gql`
	query Me {
		me {
			id,
			firstname,
			lastname,
			phoneNumber,
			userType,
			address
		}
	}
`;

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token,
			user {
				id,
				userType
			}
		}
	}
`;

export const SIGNUP = gql`
	mutation SignUp($email: String!, $password: String!, $firstname: String!, $lastname: String!, $phoneNumber: String!) {
		signup(email: $email, password: $password, firstname: $firstname, lastname: $lastname, phoneNumber: $phoneNumber) {
			token,
			user {
				userType
			}
		}
	}
`;

export const SINGLE_UPLOAD = gql`
	mutation SingleUpload($file: Upload!) {
		singleUpload(file: $file) {
			id
		}
	}
`;

export const GET_DELIVERY_PERSONNEL = gql`
	query DeliveryPersonnel($id: ID!) {
		deliveryPersonnel: user(id: $id) {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const GET_USER = gql`
	query User($id: ID!) {
		user(id: $id) {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const DELIVERY_PERSONNELS = gql`
	query DeliveryPersonnels {
		deliveryPersonnels {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const CREATE_USER = gql`
	mutation createUser($email: String!, $password: String!, $userType: UserType!, $firstname: String!, $lastname: String!, $phoneNumber: String, 
		$plateNumber: String, $profilePicture: ID, $address: String, $restaurant: RestaurantCreateInput, $assignRestaurants: [ID!]) {
		createUser(email: $email, password: $password, userType: $userType, firstname: $firstname, lastname: $lastname, phoneNumber: $phoneNumber, 
			plateNumber: $plateNumber, profilePicture: $profilePicture, address: $address, restaurant: $restaurant, assignRestaurants: $assignRestaurants) {
			...UserFragment
		}
	}
	${UserFragment}
`;



export const UPDATE_USER = gql`
	mutation UpdateUser($id: ID!, $email: String, $password: String, $firstname: String, $lastname: String, $phoneNumber: String, 
		$plateNumber: String, $profilePicture: ID, $address: String, $isActive: Boolean, $restaurant: RestaurantCreateInput, $assignRestaurants: [ID!]) {
		updateUser(id: $id, email: $email, password: $password, firstname: $firstname, lastname: $lastname, phoneNumber: $phoneNumber, 
			plateNumber: $plateNumber, profilePicture: $profilePicture, address: $address, isActive: $isActive,
			restaurant: $restaurant, assignRestaurants: $assignRestaurants) {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const RESTAURANTS = gql`
	query Restaurants($isActive: Boolean) {
		restaurants(isActive: $isActive) {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const CATEGORIES = gql`
	query Categories {
		categories {
			id,
			name,
			isActive
		}
	}
`;

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($name: String!) {
		createCategory(name: $name) {
			id,
			name,
			isActive
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($id: ID!, $name: String, $isActive: Boolean) {
		updateCategory(id: $id, name: $name, isActive: $isActive) {
			id,
			isActive
		}
	}
`;

export const GET_CATEGORY = gql`
	query Category($id: ID!) {
		category(id: $id) {
			id,
			name,
			isActive

		}
	}
`;

export const MENU_ITEMS = gql`
	query MenuItems {
		menuItems {
			...MenuItemFragment
		}
	}
	${MenuItemFragment}
`;

export const CREATE_MENU_ITEM = gql`
	mutation CreateMenuItem($name: String!, $price: Int!, $description: String!, $hasSpecialInstruction: Boolean!, 
		$thumbnail: ID!, $categories: [String!]!, $available: Boolean!) {
		createMenuItem(name: $name, price: $price, description: $description, hasSpecialInstruction: $hasSpecialInstruction, 
			thumbnail: $thumbnail, categories: $categories, available: $available) {
			...MenuItemFragment
		}
	}
	${MenuItemFragment}
`;

export const GET_MENU_ITEM = gql`
	query MenuItem($id: ID!) {
		menuItem(id: $id) {
			...MenuItemFragment
		}
	}
	${MenuItemFragment}
`;

export const UPDATE_MENU_ITEM = gql`
	mutation UpdateMenuItem($id: ID!, $name: String!, $price: Int!, $description: String!, $hasSpecialInstruction: Boolean!, 
		$thumbnail: ID, $categories: [String!]!, $available: Boolean!) {
		updateMenuItem(id: $id, name: $name, price: $price, description: $description, hasSpecialInstruction: $hasSpecialInstruction, 
			thumbnail: $thumbnail, categories: $categories, available: $available) {
			...MenuItemFragment
		}
	}
	${MenuItemFragment}
`;

export const DELETE_MENU_ITEM = gql`
	mutation DeleteMenuItem($id: ID!) {
		deleteMenuItem(id: $id) {
			id
		}
	}
`;

export const CART = gql`
	query Cart {
		cart {
			...CartFragment
		}
	}
	${CartFragment}
`;

export const ADD_TO_CART = gql`
	mutation AddToCart($restaurant: ID!, $menuItem: ID!, $quantity: Int!) {
		addToCart(restaurant: $restaurant, menuItem: $menuItem, quantity: $quantity) {
			...CartFragment
		}
	}
	${CartFragment}
`;

export const REMOVE_FROM_CART = gql`
	mutation RemoveFromCart($menuItem: ID!) {
		removeFromCart(menuItem: $menuItem) {
			...CartFragment
		}
	}
	${CartFragment}
`;

export const CHECKOUT = gql`
	mutation Checkout($address: String!) {
		checkout(address: $address) {
			...CartFragment
		}
	}
	${CartFragment}
`;

export const ORDERS = gql`
	query Orders {
		orders {
			id,
			address,
			status,
			updatedAt,
			restaurant { 
				id,
				details: restaurant {
					id,
					name
				},
				profilePicture {
					id,
					url
				}
			},
			client { id, firstname, lastname, phoneNumber,
				profilePicture {
					id,
					url
				}
			},
			deliveryPersonnel { id, firstname, lastname, phoneNumber, plateNumber,
				profilePicture {
					id,
					url
				}
			},
			items {
				id,
				price,
				description,
				specialInstruction,
				thumbnail {
					id,
					url
				},
				categories {
					id,
					name
				}
				quantity
			}
		}
	}
`;

export const ACCEPT_ORDER = gql`
	mutation AcceptOrder($id: ID!) {
		acceptOrder(id: $id) {
			id,
			status
		}
	}
`;

export const ORDER_PREPARED = gql`
	mutation OrderPrepared($id: ID!, $deliveryPersonnelId: ID!) {
		orderPrepared(id: $id, deliveryPersonnelId: $deliveryPersonnelId) {
			id,
			status
		}
	}
`;

export const ORDER_PICKED_UP = gql`
	mutation OrderPickedUp($id: ID!) {
		orderPickedUp(id: $id) {
			id,
			status
		}
	}
`;

export const ORDER_DELIVERED = gql`
	mutation OrderDelivered($id: ID!) {
		orderDelivered(id: $id) {
			id,
			status
		}
	}
`;

export const CANCEL_ORDER = gql`
	mutation CancelOrder($id: ID!) {
		cancelOrder(id: $id) {
			id,
			status
		}
	}
`;

export const MY_PERSONNELS = gql`
	query MyPersonnels {
		mypersonnels {
			id,
			firstname,
			lastname,
			plateNumber,
			phoneNumber,
		}
	}
`;

export const CREATE_POSITION = gql`
	mutation CreatePosition($latitude: Float!, $longitude: Float!) {
		createPosition(latitude: $latitude, longitude: $longitude) {
			id
		}
	}
`;

export const GET_POSITION = gql`
	query GetPosition($userId: ID!) {
		getPosition(userId: $userId) {
			id,
			latitude,
			longitude
		}
	}
`;